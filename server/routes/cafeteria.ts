import express from 'express';
import { fetchCafeteriaMenus } from '../services/cafeteriaScraper.js';

// Campus enum 정의 (types.ts와 동일하게 유지)
export enum Campus {
  SINCHON = '신촌 캠퍼스',
  SONGDO = '국제 캠퍼스 (송도)'
}

export const cafeteriaRouter = express.Router();

cafeteriaRouter.get('/', async (req, res) => {
  try {
    const campus = req.query.campus as string;
    const date = req.query.date as string | undefined;

    if (!campus || (campus !== Campus.SINCHON && campus !== Campus.SONGDO)) {
      return res.status(400).json({ 
        error: 'Invalid campus parameter. Must be "신촌 캠퍼스" or "국제 캠퍼스 (송도)"' 
      });
    }

    const menus = await fetchCafeteriaMenus(campus, date);
    
    if (!menus) {
      return res.status(404).json({ 
        error: 'Failed to fetch cafeteria menus' 
      });
    }

    res.json(menus);
  } catch (error) {
    console.error('Error in cafeteria route:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

