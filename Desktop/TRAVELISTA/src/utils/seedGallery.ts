import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';

const unsplashImages = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200',
    location: 'Paris, France',
    description: 'Eiffel Tower at sunset'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200',
    location: 'Venice, Italy',
    description: 'Iconic Venice canals'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?auto=format&fit=crop&w=1200',
    location: 'Santorini, Greece',
    description: 'Blue domed churches in Oia'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise beach'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=1200',
    location: 'Moscow, Russia',
    description: 'Saint Basil\'s Cathedral'
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&w=1200',
    location: 'Dubai, UAE',
    description: 'Modern cityscape at night'
  }
];

export const seedGallery = async () => {
  const galleryRef = collection(db, 'gallery');
  
  try {
    for (const image of unsplashImages) {
      await addDoc(galleryRef, {
        ...image,
        userId: 'unsplash',
        userName: 'Unsplash Photographer',
        timestamp: serverTimestamp(),
        likes: Math.floor(Math.random() * 100)
      });
    }
    console.log('Gallery seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding gallery:', error);
    return false;
  }
}; 