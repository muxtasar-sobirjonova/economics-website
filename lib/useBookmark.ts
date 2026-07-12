import { useState, useEffect } from 'react';

export interface SavedCard {
  id: string; // Unique identifier for the card (e.g., "concept-1", "quiz-5")
  title: string;
  lessonNumber: number;
  description: string;
  sourceSection: string; // e.g., "Concepts", "Examples", "Quizzes"
  accentColor: string; // e.g., "#EAE3D2", "#A8BCC8"
}

const LOCAL_STORAGE_KEY = 'savedCards';

export function useBookmark() {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);

  useEffect(() => {
    const storedCards = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedCards) {
      setSavedCards(JSON.parse(storedCards));
    }
  }, []);

  const updateLocalStorage = (updatedCards: SavedCard[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCards));
    setSavedCards(updatedCards);
  };

  const saveCard = (card: SavedCard) => updateLocalStorage([...savedCards.filter(c => c.id !== card.id), card]);
  const removeCard = (cardId: string) => updateLocalStorage(savedCards.filter(c => c.id !== cardId));
  const isCardSaved = (cardId: string) => savedCards.some(card => card.id === cardId);

  return { savedCards, saveCard, removeCard, isCardSaved };
}