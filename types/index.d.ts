/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// declare type Gender = "male" | "female" | "other";
// declare type Status = "pending" | "scheduled" | "cancelled";

// export interface CurrentUser {
//   firstName: string;
//   isLoggedIn: boolean;
// }

// declare interface CreateUserParams {
//   name: string;
//   email: string;
//   phone: string;
// }
// declare interface User extends CreateUserParams {
//   $id: string;
//   role?: Role;
// }

// declare interface RegisterUserParams extends CreateUserParams {
//   userId: string;
//   birthDate: Date;
//   gender: Gender;
//   address: string;
//   occupation: string;
//   emergencyContactName: string;
//   emergencyContactNumber: string;
//   primaryPhysician: string;
//   insuranceProvider: string;
//   insurancePolicyNumber: string;
//   allergies: string | undefined;
//   currentMedication: string | undefined;
//   familyMedicalHistory: string | undefined;
//   pastMedicalHistory: string | undefined;
//   identificationType: string | undefined;
//   identificationNumber: string | undefined;
//   identificationDocument: FormData | undefined;
//   privacyConsent: boolean;
// }

// declare type CreateAppointmentParams = {
//   userId: string;
//   patient: string;
//   primaryPhysician: string;
//   reason: string;
//   schedule: Date;
//   status: Status;
//   note: string | undefined;
// };

// declare type UpdateAppointmentParams = {
//   appointmentId: string;
//   userId: string;
//   timeZone: string;
//   appointment: Appointment;
//   type: string;
// };

declare type MoleculeStructure = {
  structure: string;
  score: number;
};

declare type MoleculeGenerationHistoryType = {
  _id?: string;
  smiles: string;
  numMolecules: number;
  minSimilarity: number;
  particles: number;
  iterations: number;
  generatedMolecules: MoleculeStructure[];
  createdAt?: Date;
};

declare type CreateUserParams = {
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  email: string;
  password: string;
  phone?: string;
  role: string;
  bio?: string;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  expertise?: string;
  enrolledCourses?: string;
  hourlyRate?: number;
  availability?: string;
  experienceLevel?: string;
  preferredWorkType?: string;
  languagesSpoken?: string;
  skills?: string;
  portfolioUrl?: string;
  profilePicture?: string;
  location?: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  photo: string;
  userBio?: string;
  email: string;
};

declare type CompoundData = {
  MolecularFormula: string;
  MolecularWeight: string;
  InChIKey: string;
  CanonicalSMILES: string;
  IsomericSMILES: string;
  IUPACName: string;
  XLogP: string;
  ExactMass: string;
  MonoisotopicMass: string;
  TPSA: string;
  Complexity: string;
  Charge: string;
  HBondDonorCount: string;
  HBondAcceptorCount: string;
  RotatableBondCount: string;
  HeavyAtomCount: string;
};

declare type ModalProps = {
  id: string;
  title: string;
  content: React.ReactNode;
  onCloseText: string;
};

export interface Work {
  creator?: string; // Optional, since the form might not always include it.
  category: string;
  title: string;
  description: string;
  price: number;
  photos: Array<string | File>;
}

// export interface Work {
//   _id: string;
//   title: string;
//   price: number;
//   category: string;
//   workPhotoPaths: string[];
//   creator: {
//     _id: string;
//     username: string;
//     profileImagePath: string;
//   };
// }
