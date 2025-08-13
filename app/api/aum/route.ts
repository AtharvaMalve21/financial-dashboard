import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    value: '₹2,45,67,890',
    change: '+12.5%',
    isPositive: true
  };
  
  return NextResponse.json(data);
}