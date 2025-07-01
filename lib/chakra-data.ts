export interface ChakraInfo {
  id: string;
  name: string;
  sanskrit: string;
  sanskritName: string; // Added for display in tooltips
  beejMantra: string; // Added beej mantra
  color: string;
  element: string;
  location: string;
  description: string;
  properties: string[];
  emotions: string[];
  physicalAspects: string[];
  mentalAspects: string[];
  affirmation: string;
  alignmentGuidance: string;
}

export const chakraData: ChakraInfo[] = [
  {
    id: 'root',
    name: 'Root Chakra',
    sanskrit: 'Muladhara',
    sanskritName: 'मूलाधार',
    beejMantra: 'LAM',
    color: '#E53935',
    element: 'Earth',
    location: 'Base of spine',
    description: 'The foundation of our energy system, governing survival, stability, and grounding.',
    properties: ['Grounding', 'Stability', 'Security', 'Survival'],
    emotions: ['Security', 'Trust', 'Groundedness', 'Stability'],
    physicalAspects: ['Legs', 'Feet', 'Lower back', 'Adrenal glands'],
    mentalAspects: ['Focus', 'Determination', 'Self-preservation', 'Material needs'],
    affirmation: 'I am safe, secure, and grounded in my being.',
    alignmentGuidance: 'Connect with earth energy through barefoot walking, root vegetable nutrition, and mountain pose. Practice grounding meditations while visualizing red light at your spine base. Engage in physical activities like gardening, hiking, or leg-strengthening exercises to build stability and security.'
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    sanskritName: 'स्वाधिष्ठान',
    beejMantra: 'VAM',
    color: '#FB8C00',
    element: 'Water',
    location: 'Lower abdomen, below navel',
    description: 'The center of creativity, sexuality, and emotional expression.',
    properties: ['Creativity', 'Sexuality', 'Emotions', 'Relationships'],
    emotions: ['Joy', 'Passion', 'Pleasure', 'Creativity'],
    physicalAspects: ['Reproductive organs', 'Kidneys', 'Bladder', 'Lower abdomen'],
    mentalAspects: ['Emotional balance', 'Creative expression', 'Intimacy', 'Change'],
    affirmation: 'I embrace my creativity and allow my emotions to flow freely.',
    alignmentGuidance: 'Enhance your creative flow through artistic expression, dance, and hip circles. Practice emotional release with water meditations and orange light visualization. Explore sensual pleasures mindfully, nurture intimate relationships, and engage in activities that bring you joy and passion.'
  },
  {
    id: 'solar',
    name: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    sanskritName: 'मणिपूर',
    beejMantra: 'RAM',
    color: '#D4A50A',
    element: 'Fire',
    location: 'Upper abdomen',
    description: 'The seat of personal power, confidence, and self-worth.',
    properties: ['Personal power', 'Confidence', 'Self-esteem', 'Control'],
    emotions: ['Confidence', 'Motivation', 'Personal power', 'Self-worth'],
    physicalAspects: ['Stomach', 'Liver', 'Pancreas', 'Digestive system'],
    mentalAspects: ['Willpower', 'Decision making', 'Personal identity', 'Autonomy'],
    affirmation: 'I am confident in my abilities and trust my inner wisdom.',
    alignmentGuidance: 'Build personal power through core-strengthening exercises, sun exposure, and yellow light meditation. Practice making decisive choices, set healthy boundaries, and engage in activities that boost confidence. Use warrior poses and deep breathing to ignite your inner fire and self-determination.'
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    sanskrit: 'Anahata',
    sanskritName: 'अनाहत',
    beejMantra: 'YAM',
    color: '#43A047',
    element: 'Air',
    location: 'Center of chest',
    description: 'The bridge between physical and spiritual, governing love and compassion.',
    properties: ['Love', 'Compassion', 'Connection', 'Healing'],
    emotions: ['Love', 'Compassion', 'Forgiveness', 'Peace'],
    physicalAspects: ['Heart', 'Lungs', 'Arms', 'Hands'],
    mentalAspects: ['Empathy', 'Emotional healing', 'Relationships', 'Unity'],
    affirmation: 'I give and receive love freely and unconditionally.',
    alignmentGuidance: 'Open your heart through loving-kindness meditation, heart-opening yoga poses, and green light visualization. Practice forgiveness, express gratitude daily, spend time in nature, and cultivate compassion for yourself and others. Deep breathing exercises and giving acts of service enhance heart connection.'
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    sanskritName: 'विशुध्ध',
    beejMantra: 'HAM',
    color: '#1E88E5',
    element: 'Space/Ether',
    location: 'Throat area',
    description: 'The center of communication, truth, and authentic self-expression.',
    properties: ['Communication', 'Truth', 'Expression', 'Authenticity'],
    emotions: ['Truth', 'Communication', 'Expression', 'Authenticity'],
    physicalAspects: ['Throat', 'Neck', 'Thyroid', 'Mouth'],
    mentalAspects: ['Clear communication', 'Self-expression', 'Truth speaking', 'Listening'],
    affirmation: 'I speak my truth with clarity and confidence.',
    alignmentGuidance: 'Strengthen your voice through singing, chanting, and blue light meditation. Practice honest communication, active listening, and speaking your truth with kindness. Journal regularly, engage in creative writing, and express yourself authentically through words and sound healing.'
  },
  {
    id: 'third-eye',
    name: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    sanskritName: 'आज्ञा',
    beejMantra: 'OM',
    color: '#3949AB',
    element: 'Light',
    location: 'Forehead, between eyebrows',
    description: 'The center of intuition, wisdom, and spiritual insight.',
    properties: ['Intuition', 'Wisdom', 'Insight', 'Perception'],
    emotions: ['Wisdom', 'Intuition', 'Clarity', 'Understanding'],
    physicalAspects: ['Eyes', 'Brain', 'Pituitary gland', 'Nervous system'],
    mentalAspects: ['Intuition', 'Imagination', 'Concentration', 'Self-awareness'],
    affirmation: 'I trust my intuition and see clearly with wisdom.',
    alignmentGuidance: 'Enhance intuition through meditation, mindfulness, and indigo light visualization. Practice dream journaling, third-eye point massage, and quiet contemplation. Reduce screen time, engage in visualization exercises, and trust your inner knowing to develop psychic awareness and clarity.'
  },
  {
    id: 'crown',
    name: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    sanskritName: 'सहस्रार',
    beejMantra: 'OM (Silent)',
    color: '#8E24AA',
    element: 'Thought/Consciousness',
    location: 'Top of head',
    description: 'The connection to divine consciousness and spiritual enlightenment.',
    properties: ['Spirituality', 'Enlightenment', 'Connection', 'Unity'],
    emotions: ['Spiritual', 'Connected', 'Enlightened', 'Unified'],
    physicalAspects: ['Brain', 'Pineal gland', 'Nervous system', 'Head'],
    mentalAspects: ['Spiritual connection', 'Higher consciousness', 'Universal understanding', 'Transcendence'],
    affirmation: 'I am connected to the divine wisdom of the universe.',
    alignmentGuidance: 'Connect with divine consciousness through meditation, prayer, and violet light visualization. Practice mindful presence, study spiritual teachings, and cultivate gratitude. Spend time in sacred spaces, engage in selfless service, and maintain a spiritual practice to deepen your connection to universal wisdom.'
  }
];

export const getChakraById = (id: string): ChakraInfo | undefined => {
  return chakraData.find(chakra => chakra.id === id);
};

export const getChakraByEmotion = (emotion: string): ChakraInfo | undefined => {
  return chakraData.find(chakra => 
    chakra.emotions.some(e => e.toLowerCase().includes(emotion.toLowerCase()))
  );
};