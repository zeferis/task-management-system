import pool from '../config/db.js';
import type { Request,Response } from 'express';

export const getTasks =async (req:Request,res:Response)=>{
    try{
        const result= await pool.query("SELECT * FROM tasks ORDER BY created_at DESC");
        res.status(200).json(result.rows);
    } catch(error){
        res.status(500).json({message:'Server error'});
        console.error("Get tasks error:",error);
    }
};
