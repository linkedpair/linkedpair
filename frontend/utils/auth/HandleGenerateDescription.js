import { generateProfileDescription } from "../auth/openai";

const handleGenerateDescription = async ({
  traits,
  setLoadingDesc,
  setProfileDescription,
}) => {
  if (!traits.trim()) {
    alert("Please enter your personality traits first.");
    return;
  }
  try {
    setLoadingDesc(true);
    const description = await generateProfileDescription(traits);
    setProfileDescription(description);
  } catch (error) {
    alert("Failed to generate description. Please try again.");
  } finally {
    setLoadingDesc(false);
  }
};

export default handleGenerateDescription;
