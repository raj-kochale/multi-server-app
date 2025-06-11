import { prisma } from "@repo/db";

export default async function Home() {
  try {
    console.log('Attempting to fetch user...');
    const user = await prisma.user.findFirst();
    console.log('User fetch result:', user);
    
    return (
      <div className="p-4">
        {user ? (
          <div className="space-y-2">
            <h1 className="text-xl font-bold">User Details</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <div className="text-gray-600">
            <p>No user found in the database</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    return (
      <div className="p-4 text-red-600">
        <h2 className="text-lg font-semibold">Error loading user data</h2>
        <p className="text-sm">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    );
  }
}