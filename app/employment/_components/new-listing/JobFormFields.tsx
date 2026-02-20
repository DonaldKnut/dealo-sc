"use client";

import { Control, UseFormSetValue, UseFormTrigger, FieldErrors } from "react-hook-form";
import { MapPin, Sparkles, Mail, AlertCircle } from "lucide-react";
import SelectInput from "@/components/forms/_components/SelectInput";
import TextInput from "@/components/forms/_components/TextInput";
import CustomPhoneInput from "@/components/forms/_components/PhoneInput";
import FileUpload from "@/components/forms/_components/FileUpload";
import SkillsInput from "@/components/forms/_components/SkillsInput";
import LocationSelect from "@/app/employment/_components/LocationSelect";
import nextDynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import { formTheme, formContent } from "./formTheme";
import BudgetInput from "./BudgetInput";

const ReactQuill = nextDynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface CompanyFromAPI {
  _id: string;
  name: string;
}

interface JobFormFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  trigger: UseFormTrigger<any>;
  isAuthenticated: boolean;
  companies?: CompanyFromAPI[];
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  theme?: typeof formTheme;
  content?: typeof formContent;
}

export default function JobFormFields({
  control,
  errors,
  setValue,
  trigger,
  isAuthenticated,
  companies,
  selectedCompany,
  onCompanyChange,
  theme = formTheme,
  content = formContent,
}: JobFormFieldsProps) {
  return (
    <div className="space-y-12">
      {/* Company Selection (for authenticated users) */}
      {isAuthenticated && companies && companies.length > 0 && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">
            Verification Nexus <span className="text-white/10 font-bold lowercase tracking-normal">(Optional)</span>
          </label>
          <div className="relative group/select">
            <select
              value={selectedCompany}
              onChange={(e) => onCompanyChange(e.target.value)}
              className={`w-full px-6 py-5 bg-white/[0.03] border border-white/[0.08] rounded-[1.25rem] outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all font-black text-[11px] uppercase tracking-widest text-emerald-400 appearance-none hover:bg-white/[0.05] cursor-pointer`}
            >
              <option value="" className="bg-[#0a0a0a] text-white/40">GENERATE INDEPENDENT LISTING</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id} className="bg-[#0a0a0a] text-emerald-400">
                  {company.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500/40">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!isAuthenticated && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Origin Entity</label>
              <TextInput
                name="companyName"
                label=""
                control={control}
                errorMessage={errors.companyName?.message as string | undefined}
                placeholder="E.G. NEURAL SYNESTHETICS"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Comms Protocol (Email)</label>
              <TextInput
                name="contactEmail"
                label=""
                control={control}
                type="email"
                errorMessage={errors.contactEmail?.message as string | undefined}
                placeholder="OPERATIONS@ENTITY.ORG"
              />
            </div>
          </>
        )}

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Opportunity Manifestation (Title)</label>
          <TextInput
            name="title"
            label=""
            control={control}
            errorMessage={errors.title?.message as string | undefined}
            placeholder="E.G. SENIOR ARCHITECT: DISTRIBUTED LEDGER SYSTEMS"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Operational Domain</label>
          <SelectInput
            name="category"
            label=""
            control={control}
            options={[
              { value: "Business Development", label: "BUSINESS DEVELOPMENT" },
              { value: "Construction", label: "INFRASTRUCTURE & CONSTRUCTION" },
              { value: "Customer Service", label: "OPERATIONAL SUPPORT" },
              { value: "Finance", label: "QUANTITATIVE FINANCE" },
              { value: "Healthcare", label: "BIOMETRIC HEALTHCARE" },
              { value: "Human Resources", label: "TALENT COORDINATION" },
              { value: "Software Engineering", label: "SYSTEMS ARCHITECTURE" },
              { value: "Marketing", label: "STRATEGIC EXPANSION" },
              { value: "Design", label: "VISUAL SYNTHESIS" },
              { value: "Sales", label: "REVENUE OPTIMIZATION" },
            ]}
            errorMessage={errors.category?.message as string | undefined}
          />
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">
          Detailed Mission Briefing <span className="text-emerald-500/40">*</span>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="rounded-[1.5rem] overflow-hidden border border-white/[0.08] bg-white/[0.01] hover:border-white/20 focus-within:border-emerald-500/40 transition-all backdrop-blur-3xl custom-quill-container">
              <ReactQuill
                theme="snow"
                value={value}
                onChange={(newValue) => {
                  onChange(newValue);
                  trigger("description");
                }}
                className="bg-transparent text-white custom-quill"
                placeholder="Define the scope, objectives, and specialized requirements for this deployment..."
              />
            </div>
          )}
        />
        {errors.description && (
          <p className="mt-2 text-[10px] font-black text-red-500/70 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            {errors.description?.message as string}
          </p>
        )}
      </div>

      {/* Expertise & Compensation Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <div className={`space-y-6 ${theme.sectionCard.padding} bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] shadow-2xl`}>
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-emerald-500" /> Competency Matrix
          </h4>
          <SkillsInput
            name="skillsRequired"
            label="Required Skillsets"
            control={control}
            setValue={setValue}
            trigger={trigger}
            errorMessage={errors.skillsRequired?.message as string | undefined}
          />
          <div className="space-y-2 pt-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Seniority Rank (Years)</label>
            <TextInput
              name="experienceRequired"
              label=""
              control={control}
              type="number"
              placeholder="E.G. 5"
              errorMessage={errors.experienceRequired?.message as string | undefined}
            />
          </div>
        </div>

        <div className={`space-y-6 ${theme.sectionCard.padding} bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] shadow-2xl`}>
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
            Budgetary Parameters
          </h4>
          <BudgetInput
            name="budget"
            label="Compensation Range"
            control={control}
            errorMessage={errors.budget?.message as string | undefined}
            theme={theme}
          />
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Deployment Deadline</label>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => {
                const today = new Date().toISOString().split("T")[0];
                return (
                  <input
                    type="date"
                    {...field}
                    min={today}
                    className={`w-full px-6 py-4 ${theme.input.background} ${theme.input.border} ${theme.input.borderRadius} ${theme.input.text} ${theme.input.placeholder} ${theme.input.backdropBlur} ${theme.input.hover} ${theme.input.borderFocus} ${theme.input.ringFocus} outline-none transition-all uppercase tracking-widest text-[11px]`}
                  />
                );
              }}
            />
            {errors.deadline && (
              <p className="text-[10px] font-black text-red-500/70 uppercase tracking-widest mt-1">
                {errors.deadline?.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Logistics */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] shadow-2xl`}>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 text-center block w-full mb-4">Work Modality</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['onsite', 'hybrid', 'remote'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setValue("remote", loc)}
                className={`py-4 rounded-xl font-black text-[9px] uppercase tracking-widest border transition-all duration-500 ${control._formValues.remote === loc
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-white/[0.03] text-white/30 border-white/[0.05] hover:border-white/20"
                  }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1 text-center block w-full mb-4">Listing Vector (Type)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { v: "full-time", l: "FULL-TIME" },
              { v: "part-time", l: "PART-TIME" },
              { v: "contract", l: "CONTRACT" },
            ].map((t) => (
              <button
                key={t.v}
                type="button"
                onClick={() => setValue("type", t.v)}
                className={`py-3 rounded-xl font-black text-[8px] uppercase tracking-tighter border transition-all duration-500 ${control._formValues.type === t.v
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-white/[0.03] text-white/20 border-white/[0.05] hover:border-white/10"
                  }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Precise GEO-Location */}
      <div className={`space-y-6 p-10 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] shadow-2xl`}>
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
          <MapPin className="w-4 h-4 text-emerald-500" />
          GEO-Location Targeting
        </h3>
        <LocationSelect control={control} />
      </div>

      {/* Communications Protocols */}
      <div className={`space-y-10 p-12 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] shadow-2xl relative overflow-hidden group/signal`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Mail className="w-5 h-5 text-emerald-400" />
          </div>
          Signal Decoding (Contact)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div className="space-y-2">
            <CustomPhoneInput
              name="contactPhone"
              label="Verified Signal Number"
              control={control}
              errors={errors}
            />
            <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em] ml-2">International Protocol Required</p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-1">Visual Manifestation (Icon)</label>
            <FileUpload
              name="jobIcon"
              label=""
              control={control}
              errorMessage={errors.jobIcon?.message as string | undefined}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-quill .ql-toolbar {
          background: rgba(255, 255, 255, 0.02);
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 1.5rem 1.5rem 0 0;
          padding: 1.5rem !important;
        }
        .custom-quill .ql-container {
          border: none !important;
          min-height: 250px;
          font-family: inherit;
        }
        .custom-quill .ql-editor {
          font-size: 0.9rem;
          color: white;
          padding: 2rem;
          font-weight: 500;
          line-height: 1.6;
        }
        .custom-quill .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.1);
          font-style: normal;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
        }
        .custom-quill .ql-stroke {
          stroke: rgba(255, 255, 255, 0.3) !important;
        }
        .custom-quill .ql-fill {
          fill: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
}

