
"use client"


//Zod schema

const loginSchema = z.object({
    email:z.string().min(1,"Emial required").("Email right formate")
password: z.string().min(6,"Password at least 6 character")
})