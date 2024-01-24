
const z = require('zod');


function validateUser(user) {
    const schema = z.object({
        name: z.string().min(3).max(30),
        email: z.string().min(5).max(30).email(),
        password: z.string().min(5).max(15)
    });
    return schema.parse(user);
}

module.exports = {validateUser};