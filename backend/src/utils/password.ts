import argon2 from 'argon2';


export async function hash_password(password: string): Promise<string> {
    // const hashedPassword = await bcrypt.hash(password, 16); works as well cause 2nd argument
    // gens salt in bcrypt, jorge :)

    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        saltLength: 16,
        parallelism: 1,
        timeCost: 2,
    });
}

export async function check_password(password: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(password, hashedPassword, {type: argon2.argon2id});
}
