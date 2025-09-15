import { NextResponse } from 'next/server';
import transportationData from '../../../../../data/transportation-data.json';

export async function GET() {
  try {
    return NextResponse.json(transportationData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transportation data' }, { status: 500 });
  }
}
