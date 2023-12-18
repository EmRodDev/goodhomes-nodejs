import bcrypt from 'bcrypt';


const users = [
    {
        name: 'Admin',
        email: 'admin@admin.com',
        confirmed: 1,
        password: bcrypt.hashSync('1234',10)
    },
    {
        name: 'User',
        email: 'user@user.com',
        confirmed: 1,
        password: bcrypt.hashSync('1234',10)
    }
]

export default users;