const faculties = [
  "Arts and Social Sciences",
  "Business",
  "Computing",
  "Continuing and Lifelong Education",
  "Dentistry",
  "Design and Engineering",
  "Duke-NUS",
  "Law",
  "Medicine",
  "Music",
  "NUS College",
  "NUS Graduate School",
  "Public Health",
  "Public Policy",
  "Science",
  "Yale-NUS",
];

export const facultiesData = faculties.map((faculty) => ({
  label: faculty,
  value: faculty,
}));

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const zodiacSignsData = zodiacSigns.map((zodiac) => ({
  label: zodiac,
  value: zodiac,
}));

export const zodiacSignsWithAnyData = [
  { label: "Any", value: "" },
  ...zodiacSignsData,
];

export const yesNoData = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const yearsOfStudy = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

export const yearsOfStudyData = yearsOfStudy.map((year) => ({
  label: year,
  value: year,
}));

export const yearsOfStudyWithAnyData = [
  { label: "Any", value: "" },
  ...yearsOfStudyData,
];
