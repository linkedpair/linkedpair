import React, { useEffect } from "react";

export default function useMatch({ matchAlgo, setShowNoUserFound, setMatchedUser, refresh, user, userData }) {
  useEffect(() => {
    if (!user || !userData) return;

    let timer = setTimeout(() => {
      setShowNoUserFound(true)
    }, 2000);

    const fetchMatch = async () => {
      try {
        const result = await matchAlgo({ ...user, ...userData });

        if (result) {
          clearTimeout(timer)
          const matchedUserData = result.match || result;
          const compatibilityScore =
            typeof result.compatibilityScore === "number"
              ? result.compatibilityScore
              : undefined;

          setMatchedUser({ ...matchedUserData, compatibilityScore });
        }
      } catch (error) {
        alert(error);
      }
    };

    fetchMatch();

    return () => clearTimeout(timer);
  }, [refresh]);
}