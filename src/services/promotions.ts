import { apiUrl } from '@/config/api';
import { Promotion, CreatePromotion } from '@/types/promotion';

export async function getPromotionsByOfferId(offerId: string): Promise<Promotion[]> {
  try {
    const response = await fetch(apiUrl(`api/promotions/offer/${offerId}`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error fetching promotions: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get promotions', error);
    return [];
  }
}
export async function createPromotion(promotion: CreatePromotion): Promise<Promotion | null> {
  try {
    const response = await fetch(apiUrl('api/promotions'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promotion),
    });

    if (!response.ok) {
      throw new Error(`Error creating promotion: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create promotion', error);
    return null;
  }
}

export async function deletePromotion(id: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl(`api/promotions/${id}`), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return false;
  }
}
