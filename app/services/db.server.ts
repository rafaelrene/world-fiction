import neo4j from "neo4j-driver";

export const db = async (query: string, parameters?: object) => {
    if (process.env.DB_AURA_URL === undefined) {
        throw new Error(`DB_AURA_URL must be provided!`);
    }

    if (process.env.DB_USER_NAME === undefined) {
        throw new Error(`DB_USER_NAME must be provided!`);
    }

    if (process.env.DB_PASSWORD === undefined) {
        throw new Error(`DB_PASSWORD must be provided!`);
    }

    const driver = neo4j.driver(
        process.env.DB_AURA_URL,
        neo4j.auth.basic(process.env.DB_USER_NAME, process.env.DB_PASSWORD)
    );

    const session = driver.session();

    const result = await session.writeTransaction((tx) =>
        tx.run(query, parameters)
    );

    await session.close();
    await driver.close();

    return result;
};
