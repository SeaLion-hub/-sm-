import express from 'express';
import { fetchNearbyRestaurants } from '../services/restaurantService.js';

// Campus enum 정의 (types.ts와 동일하게 유지)
export enum Campus {
  SINCHON = '신촌 캠퍼스',
  SONGDO = '국제 캠퍼스 (송도)'
}

export const restaurantRouter = express.Router();

restaurantRouter.get('/', async (req, res) => {
  try {
    const campus = req.query.campus as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    if (!campus || (campus !== Campus.SINCHON && campus !== Campus.SONGDO)) {
      return res.status(400).json({ 
        error: 'Invalid campus parameter. Must be "신촌 캠퍼스" or "국제 캠퍼스 (송도)"' 
      });
    }

    const restaurants = await fetchNearbyRestaurants(campus, limit);
    
    res.json({ 
      campus: campus as Campus, 
      restaurants 
    });
  } catch (error) {
    console.error('Error in restaurant route:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

