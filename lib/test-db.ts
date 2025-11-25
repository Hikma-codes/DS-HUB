// lib/test-db.ts

import 'dotenv/config'; // Load DATABASE_URL from .env
import pkg from 'pg';
const { Pool } = pkg;

import {
    USER_TABLE_SQL,
    MENTOR_TABLE_SQL,
    COURSE_TABLE_SQL,
    VIDEO_TABLE_SQL,
    ENROLLMENT_TABLE_SQL,
    FEEDBACK_TABLE_SQL,
    SESSION_TABLE_SQL,
    PROGRESS_TABLE_SQL
} from './db';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function createTables() {
    try {
        await pool.connect();
        console.log('Connected to database');

        const tables = [
            USER_TABLE_SQL,
            MENTOR_TABLE_SQL,
            COURSE_TABLE_SQL,
            VIDEO_TABLE_SQL,
            ENROLLMENT_TABLE_SQL,
            FEEDBACK_TABLE_SQL,
            SESSION_TABLE_SQL,
            PROGRESS_TABLE_SQL,
        ];

        for (const sql of tables) {
            await pool.query(sql);
            console.log('Table created/executed successfully');
        }

        console.log('All tables executed!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await pool.end();
        console.log('Connection closed');
    }
}

createTables();
