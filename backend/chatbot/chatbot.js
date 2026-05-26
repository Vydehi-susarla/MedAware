const disposalGuidelines = [
  {
    keywords: ['tablet', 'pill', 'capsule', 'solid', 'tablets', 'pills', 'capsules'],
    answer: "For solid medicines like tablets and capsules, follow these steps if a take-back program isn't available:\n1. Mix the intact tablets/capsules (do not crush them) with an unappealing substance such as used coffee grounds, dirt, or cat litter.\n2. Place the mixture in a container, like a sealed plastic bag.\n3. Throw the container in your household trash.\n4. Scratch out all personal details on the original prescription bottle before recycling or throwing it away."
  },
  {
    keywords: ['syrup', 'liquid', 'drop', 'drops', 'liquids', 'cream', 'creams', 'ointment'],
    answer: "For liquid medicines, syrups, and ointments:\n1. Pour the liquid or squeeze the cream into a sealable plastic bag.\n2. Add an absorbing material like used coffee grounds, dirt, or cat litter to absorb it.\n3. Seal the bag securely and place it in the household trash.\n4. Ensure you scratch out all personal information on the container before disposal."
  },
  {
    keywords: ['flush', 'toilet', 'sink', 'down the drain', 'opioid', 'fentanyl', 'oxycodone', 'morphine'],
    answer: "Some highly potent medicines are on the FDA's 'Flush List' because they are dangerous if accidentally ingested by children or pets. These medicines (such as fentanyl, oxycodone, morphine, buprenorphine) should be flushed down the sink or toilet immediately if a drug take-back program is not readily available. Check the packaging or ask a pharmacist if your medicine is flushable."
  },
  {
    keywords: ['can i use', 'take expired', 'safe to use', 'still good', 'expire', 'expired', 'date'],
    answer: "It is strongly recommended NOT to use expired medicines. Once the expiration date has passed, there is no guarantee that the medicine is safe or effective. Chemical composition can change, strength can decrease, and certain medicines (like liquid antibiotics) can breed bacteria. Taking sub-potent medicines (especially antibiotics) can fail to cure your condition and lead to drug-resistant infections."
  },
  {
    keywords: ['take back', 'take-back', 'drop box', 'collection site', 'pharmacy', 'collector', 'dispose pharmacy', 'walgreens', 'cvs', 'police'],
    answer: "The best and safest way to dispose of unused or expired medicines is through an authorized drug take-back program, site, or drop box. Many local pharmacies (like CVS or Walgreens) and police stations have secure collection boxes. You can search for nearby authorized collectors on the DEA website or check with your local waste management agency."
  },
  {
    keywords: ['sharp', 'needle', 'syringe', 'inject', 'needles', 'syringes'],
    answer: "Needles and syringes (sharps) should never be thrown directly into household trash or recycling.\n1. Place them in a rigid, puncture-resistant sharps disposal container (or a heavy-duty plastic container, like a laundry detergent bottle, taped shut) immediately after use.\n2. Dispose of the container according to your community's guidelines (some areas have special drop-offs or mail-back programs)."
  }
];

const getChatbotResponse = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) {
    return "Hello! I am your MedAware disposal assistant. How can I help you safely handle or dispose of expired medicines today?";
  }

  // Find best match by checking how many keywords are present in the query
  let bestMatch = null;
  let maxMatchedKeywords = 0;

  for (const guideline of disposalGuidelines) {
    let matchCount = 0;
    for (const keyword of guideline.keywords) {
      if (normalizedQuery.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > maxMatchedKeywords) {
      maxMatchedKeywords = matchCount;
      bestMatch = guideline;
    }
  }

  if (bestMatch && maxMatchedKeywords > 0) {
    return bestMatch.answer;
  }

  // Default fallback response
  return "I'm not sure about that specific query. Generally, you can dispose of most medicines by mixing them with coffee grounds or cat litter in a sealed bag and throwing them in the trash. Never flush medicines unless they are on the FDA's 'Flush List' (like strong pain relievers/opioids). The safest option is always to find a local pharmacy take-back drop box.";
};

module.exports = { getChatbotResponse };
