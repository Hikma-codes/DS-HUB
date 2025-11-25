// Lightweight supabase client shim for local development and typechecking
export async function createClient() {
    return {
        auth: {
            getUser: async () => ({ data: { user: { id: "dev-user" } } }),
        },
        from: (table: string) => ({
            insert: (rows: any[]) => ({
                select: async () => ({ data: rows, error: null }),
            }),
        }),
    }
}

export default createClient
