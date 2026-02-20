"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, FileText, Upload, Plus, HardDrive } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const DrivePage = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources || []);
        // Separate resources into folders and files
        // This would need proper folder/file structure from API
        setFolders([]);
        setFiles([]);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      setFolders([]);
      setFiles([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Drive</h1>
        <p className="text-gray-400">
          Manage your files and resources in one place
        </p>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">
                {resources.length > 0 ? "Calculating..." : "0 GB"}
              </p>
              <p className="text-gray-400 text-sm">Used Storage</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{resources.length}</p>
              <p className="text-gray-400 text-sm">Total Files</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">{folders.length}</p>
              <p className="text-gray-400 text-sm">Folders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Folders */}
      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="px-4 py-3 border-b border-white/10 text-gray-300 text-sm">
          Folders
        </div>
        {folders.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-8 h-8 text-blue-400" />
                  <div>
                    <div className="text-white font-semibold">{folder.name}</div>
                    <div className="text-xs text-gray-400">
                      {folder.count} items
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Folders Not Created Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Be the first to organize your files into folders</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Folder
            </button>
          </div>
        )}
      </div>

      {/* Files */}
      <div className="bg-white/5 border border-white/10 rounded-xl">
        <div className="px-4 py-3 border-b border-white/10 text-gray-300 text-sm">
          Recent Files
        </div>
        {files.length > 0 || resources.length > 0 ? (
          <div className="divide-y divide-white/10">
            {files.map((file) => (
              <div
                key={file.id}
                className="px-4 py-3 flex items-center justify-between hover:bg-white/10"
              >
                <div className="flex items-center gap-3 text-white">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>{file.name}</span>
                </div>
                <div className="text-xs text-gray-400">{file.size}</div>
              </div>
            ))}
            {resources.map((r) => (
            <div
              key={r._id}
              className="px-4 py-3 flex items-center justify-between hover:bg-white/10"
            >
              <div className="flex items-center gap-3 text-white">
                <FileText className="w-4 h-4 text-green-400" />
                <span>{r.title}</span>
                {r.isPaid && (
                  <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                    {r.currency} {r.price}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">
                  {(r.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                </div>
                {r.isPaid && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/checkout/resource", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            resourceId: r._id,
                            provider: "paystack",
                          }),
                        });
                        const data = await res.json();
                        if (data.paymentUrl && typeof window !== "undefined") {
                          window.open(data.paymentUrl, "_blank");
                        }
                      } catch (e) {
                        console.error(e);
                        alert("Failed to initiate payment");
                      }
                    }}
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Files Not Created Yet</h3>
            <p className="text-gray-400 text-sm mb-4">Be the first to upload files to your drive</p>
            <label className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm inline-flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload File
            </label>
          </div>
        )}
      </div>

      {/* Resource Uploader */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-300 text-sm">
            Upload Resources (PDF/ZIP up to{" "}
            {process.env.MAX_RESOURCE_SIZE_MB || 25}MB)
          </div>
          <input
            type="file"
            accept=".pdf,.zip,application/pdf,application/zip"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setUploadError(null);
              setUploading(true);
              setUploadProgress(0);
              try {
                const type =
                  f.type ||
                  (f.name.endsWith(".pdf")
                    ? "application/pdf"
                    : "application/zip");
                const okRes = await fetch(
                  `/api/resources/upload-url?size=${
                    f.size
                  }&type=${encodeURIComponent(type)}`
                );
                const okJson = await okRes.json();
                if (!okRes.ok || !okJson.allowed)
                  throw new Error(okJson.error || "Not allowed");

                const form = new FormData();
                form.append("file", f);
                const uploadUrl = "/api/upload";
                await new Promise<void>((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open("POST", uploadUrl);
                  xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable)
                      setUploadProgress(Math.round((e.loaded / e.total) * 100));
                  };
                  xhr.onload = () => resolve();
                  xhr.onerror = () => reject(new Error("Upload failed"));
                  xhr.send(form);
                });

                const saveRes = await fetch("/api/resources", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    title: f.name,
                    url: "/files/" + encodeURIComponent(f.name),
                    type,
                    sizeBytes: f.size,
                    sectionId:
                      resources[0]?.sectionId || "000000000000000000000000",
                    isPaid: false,
                    price: 0,
                    currency: "NGN",
                  }),
                });
                if (!saveRes.ok) throw new Error("Save failed");
                const saved = await saveRes.json();
                setResources([saved.resource, ...resources]);
              } catch (err: any) {
                setUploadError(err?.message || "Upload failed");
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>
        {uploading && (
          <div className="text-xs text-gray-300">
            Uploading... {uploadProgress}%
          </div>
        )}
        {uploadError && (
          <div className="text-xs text-red-400">{uploadError}</div>
        )}
      </div>
    </div>
  );
};

export default DrivePage;



