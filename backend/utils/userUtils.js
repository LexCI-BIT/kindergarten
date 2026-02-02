const formatUser = (data) => ({
    id: data.id,
    email: data.email,
    role: data.role,
    name: data.super_admin_name || data.email.split('@')[0],
    phoneNumber: data.phone_number,
    isSuperAdmin: data.is_super_admin,
    photo: data.photo
});

module.exports = {
    formatUser
};
