export type User = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'doctor' | 'nurse' | 'admin' | 'receptionist';
  token?: string;
};

export type AuthResponse = {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  token: string;
};

export type Patient = {
  _id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse?: string;
  telephone?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FichierMedical = {
  nom: string;
  url: string;
  type: string;
};

export type DossierMedical = {
  _id: string;
  patientId: string | Patient;
  diagnostic?: string;
  traitements?: string;
  fichiers?: FichierMedical[];
  medecinResponsable?: string | User;
  dateArchivage?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
