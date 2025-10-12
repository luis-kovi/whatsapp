import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ 
  storage,
  limits: { fileSize: 16 * 1024 * 1024 } // 16MB
});

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`;
    
    let mediaType = 'document';
    if (req.file.mimetype.startsWith('image/')) mediaType = 'image';
    else if (req.file.mimetype.startsWith('video/')) mediaType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) mediaType = 'audio';

    res.json({ 
      url: fileUrl,
      mediaType,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
};
