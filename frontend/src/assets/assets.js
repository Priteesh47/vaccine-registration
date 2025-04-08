import vac1 from "./vac1.jpg";
import vac2 from "./vac2.jpg";
import vac3 from "./vac3.jpg";
import vac4 from "./vac4.jpg";
import vac5 from "./vac5.jpg";
import vac6 from "./vac6.jpg";
import vac7 from "./vac7.jpg";
import vac8 from "./vac8.jpg";
import vac9 from "./vac9.jpg";
import vac10 from "./vac10.jpg";
import vac11 from "./vac11.jpg";
import vac12 from "./vac12.jpg";
import vac13 from "./vac13.jpg";
import vac14 from "./vac14.jpg";
import vac15 from "./vac15.jpg";
import vac16 from "./vac16.jpg";
import vac17 from "./vac17.jpg";
import vac18 from "./vac18.jpg";
import vac19 from "./vac19.jpg";
import vac20 from "./vac20.jpg";
import profile from "./profile.jpg";
import dropdown from "./dropdown.png";
import appointment from "./appointment.jpg";
import about from "./about.jpg";
import contact from "./contact.jpg";
import faq from "./faq.jpg";
import login from "./login.jpg";

//centers

import cen1 from "./cen1.jpg";
import cen2 from "./cen2.jpg";
import cen3 from "./cen3.jpg";
import cen4 from "./cen4.jpg";
import cen5 from "./cen5.jpg";
import cen6 from "./cen6.jpg";
import cen7 from "./cen7.jpg";
import { useLinkClickHandler } from "react-router-dom";

export const assets = {
  vac1,
  vac2,
  vac3,
  vac4,
  vac5,
  vac6,
  vac7,
  vac8,
  vac9,
  vac10,
  vac11,
  vac12,
  vac13,
  vac14,
  vac15,
  vac16,
  vac17,
  vac18,
  vac19,
  vac20,
  profile,
  dropdown,
  appointment,
  about,
  contact,
  faq,
  login,
  cen1,
  cen2,
  cen3,
  cen4,
  cen5,
  cen6,
  cen7,
};

export const vaccines = [
  {
    _id: "vac1",
    name: "Mpox",
    image: vac1,
    features: "Immunity against monkeypox, for high-risk individuals.",
    dosage: "Single or two-dose.",
    speciality: "Monkeypox",
  },
  {
    _id: "vac2",
    name: "Covid",
    image: vac2,
    features: "mRNA COVID-19 vaccine, prevents severe illness.",
    dosage: "Two doses + boosters.",
    speciality: "COVID-19",
  },
  {
    _id: "vac3",
    name: "Rabies",
    image: vac3,
    features: "Prevents rabies, given after animal bites.",
    dosage: "3 doses (pre), 4-5 doses (post).",
    speciality: "Rabies",
  },
  {
    _id: "vac4",
    name: "Dengue",
    image: vac4,
    features: "Reduces severe dengue risk in endemic areas.",
    dosage: "Two doses, 6 months apart.",
    speciality: "Dengue",
  },
  {
    _id: "vac5",
    name: "Hepatitis A",
    image: vac5,
    features: "Protects against Hepatitis A liver disease.",
    dosage: "Two doses, 6 months apart.",
    speciality: "Hepatitis A",
  },
  {
    _id: "vac6",
    name: "HPV",
    image: vac6,
    features: "Prevents HPV infections, including cervical cancer.",
    dosage: "2 doses (9-14), 3 doses (15-26).",
    speciality: "HPV",
  },
  {
    _id: "vac7",
    name: "Diphtheria",
    image: vac7,
    features: "Guards against respiratory bacterial infection.",
    dosage: "DTaP series + boosters.",
    speciality: "Diphtheria",
  },
  {
    _id: "vac8",
    name: "Tetanus",
    image: vac8,
    features: "Prevents muscle spasms from tetanus infection.",
    dosage: "3-dose series + boosters.",
    speciality: "Tetanus",
  },
  {
    _id: "vac9",
    name: "Influenza",
    image: vac9,
    features: "Annual flu shot reduces severity and risk.",
    dosage: "Single annual dose.",
    speciality: "Influenza",
  },
  {
    _id: "vac10",
    name: "RSV",
    image: vac10,
    features: "Prevents severe RSV infections in infants/elderly.",
    dosage: "Single or multi-dose.",
    speciality: "RSV",
  },
  {
    _id: "vac11",
    name: "Polio",
    image: vac11,
    features: "Provides immunity against poliovirus, prevents paralysis.",
    dosage: "Multiple doses (oral or injection).",
    speciality: "Polio",
  },
  {
    _id: "vac12",
    name: "Measles",
    image: vac12,
    features: "Prevents measles infection, usually combined in MMR.",
    dosage: "Two doses (childhood).",
    speciality: "Measles",
  },
  {
    _id: "vac13",
    name: "Mumps",
    image: vac13,
    features: "Part of MMR, protects against mumps virus.",
    dosage: "Two doses.",
    speciality: "Mumps",
  },
  {
    _id: "vac14",
    name: "Rubella",
    image: vac14,
    features: "Included in MMR, prevents rubella infection.",
    dosage: "Two doses.",
    speciality: "Rubella",
  },
  {
    _id: "vac15",
    name: "Varicella (Chickenpox)",
    image: vac15,
    features: "Protects against varicella-zoster virus (chickenpox).",
    dosage: "Two doses.",
    speciality: "Varicella",
  },
  {
    _id: "vac16",
    name: "Shingles",
    image: vac16,
    features: "Prevents shingles in adults over 50.",
    dosage: "Two doses.",
    speciality: "Shingles",
  },
  {
    _id: "vac17",
    name: "Pneumococcal",
    image: vac17,
    features: "Protects against pneumonia and meningitis.",
    dosage: "One or two doses.",
    speciality: "Pneumococcal",
  },
  {
    _id: "vac18",
    name: "Meningococcal",
    image: vac18,
    features: "Prevents meningitis, recommended for teenagers.",
    dosage: "One or two doses.",
    speciality: "Meningococcal",
  },
  {
    _id: "vac19",
    name: "Hepatitis B",
    image: vac19,
    features: "Provides lifelong immunity against Hepatitis B.",
    dosage: "Three doses.",
    speciality: "Hepatitis B",
  },
  {
    _id: "vac20",
    name: "Rotavirus",
    image: vac20,
    features: "Protects infants from severe diarrhea.",
    dosage: "Two or three doses.",
    speciality: "Rotavirus",
  },
];

export const Centers = [
  {
    name: "National Vaccination Centers",
    address: "Nottingham UK",
    image: cen1,
    email: "NationalHospital@gmail.com",
  },

  {
    name: "Birnigham Hospital",
    address: "Birmingham UK",
    image: cen2,
    email: "Birmingham@gmail.com",
  },

  {
    name: "Mediciti Hospital",
    address: "Nakkhu Kathmandu",
    image: cen3,
    email: "Mediciti@gmail.com",
  },

  {
    name: "Amsterdam Vaccine Provider",
    address: "Amsterdam Netherlands",
    image: cen4,
    email: "amsternvacc@gmail.com",
  },

  {
    name: "Norvic Hospital",
    address: "Thapathali Kathmandu",
    image: cen5,
    email: "NorvicNep@gmail.com",
  },

  {
    name: "Civil Service Hospital",
    address: "New Baneshwore kathmandu",
    image: cen6,
    email: "civilserv@gmail.com",
  },

  {
    name: "BnB Hospital",
    address: "Gwarko, Lalitpur",
    image: cen7,
    email: "bnbhosp@gmail.com",
  },
];

export const specialityData = [
  {
    speciality: "Monkeypox",
    description: "Vaccines for prevention of Monkeypox.",
    image: vac1,
  },
  {
    speciality: "COVID-19",
    description: "Vaccines for prevention of COVID-19 related illnesses.",
    image: vac2,
  },
  {
    speciality: "Rabies",
    description:
      "Vaccines for protection against rabies, especially after animal bites.",
    image: vac3,
  },
  {
    speciality: "Dengue",
    description:
      "Vaccines designed to reduce the risk of severe dengue in endemic areas.",
    image: vac4,
  },
  {
    speciality: "Hepatitis A",
    description: "Vaccines that protect against Hepatitis A liver disease.",
    image: vac5,
  },
  {
    speciality: "HPV",
    description:
      "Vaccines that prevent HPV infections, including cervical cancer.",
    image: vac6,
  },
  {
    speciality: "Diphtheria",
    description:
      "Vaccines that guard against respiratory bacterial infections like Diphtheria.",
    image: vac7,
  },
  {
    speciality: "Tetanus",
    description:
      "Vaccines that prevent tetanus infection and related muscle spasms.",
    image: vac8,
  },
  {
    speciality: "Influenza",
    description: "Vaccines for seasonal influenza (flu) prevention.",
    image: vac9,
  },
  {
    speciality: "RSV",
    description:
      "Vaccines designed to prevent severe RSV infections in vulnerable populations.",
    image: vac10,
  },
  {
    speciality: "Polio",
    description:
      "Vaccines for immunity against poliovirus and prevention of paralysis.",
    image: vac11,
  },
  {
    speciality: "Measles",
    description: "Vaccines that prevent measles infection.",
    image: vac12,
  },
  {
    speciality: "Mumps",
    description: "Vaccines that protect against mumps virus, part of MMR.",
    image: vac13,
  },
  {
    speciality: "Rubella",
    description:
      "Vaccines to prevent rubella infection, often combined with measles and mumps.",
    image: vac14,
  },
];
