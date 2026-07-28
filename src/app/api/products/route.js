import pool from '../../../lib/db';
import {NextResponse} from 'next/server';

export async function GET() {
    try {
        // Run the SQL query using the pool you just set up
        const[products] = await pool.query(
            ' SELECT * FROM products WHERE is_available = true'
        );
        // Return the data as a clean JSON response
        return NextResponse.json(products);
    }
    catch (error) {
            return NextResponse.json (
                { error : ' Database connection failed', details: error.message},
                {status: 500}
            )
    }
}