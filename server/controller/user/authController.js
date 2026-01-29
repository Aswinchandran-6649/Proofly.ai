
const User = require('../../model/user/UserModel'); // Changed Userr to User to match your model export
const Notification = require('../../model/user/notificationModel'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Controller
exports.register = async (req, res) => {
    // Frontend sends 'username', 'email', 'password'
    const { username, email, password, role } = req.body; 
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const newUser = await User.create({ 
            name: username, 
            username: username, 
            email, 
            password: hashedPassword, 
            role: role || 'user',
            profilePic: "" 
        });

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
res.status(201).json({ 
    token, 
    user: { 
        _id: newUser._id, // <--- ADD THIS
        username: newUser.username, 
        role: newUser.role, 
        email: newUser.email,
        profilePic: newUser.profilePic 
    } 
});
    } catch (err) {
        res.status(500).json({ message: 'Register Error', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Email' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Password' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
res.status(200).json({ 
    token, 
    user: { 
        _id: user._id, 
        username: user.username || user.name || "User", 
        role: user.role, 
        email: user.email, 
        profilePic: user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
    } 
});
    } catch (err) {
        res.status(500).json({ message: 'Login Error' });
    }
};

// Google Login Controller
exports.googleLoginController = async (req, res) => {
    const { token, role } = req.body;

    try {
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const googleUser = await googleResponse.json();

        if (!googleUser.email) {
            return res.status(401).json("Invalid Google Token");
        }

        const { name, email, picture } = googleUser;
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name: name,
                username: email.split('@')[0], // Create a unique username from email
                email,
                password: "", 
                profilePic: picture,
                role: role || 'user'
            });
            await user.save();
        }

        const systemToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

res.status(200).json({
    token: systemToken,
    user: {
        _id: user._id, // <--- ADD THIS
        username: user.username || user.name,
        email: user.email,
        profilePic: user.profilePic || picture,
        role: user.role
    }
});

    } catch (err) {
        console.error(err);
        res.status(401).json("Google Authentication Failed");
    }
};



exports.editProfile = async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { username, phone, password } = req.body;
    const profilePic = req.file ? req.file.filename : req.body.profilePic;

    try {
        const updateData = { username, phone, profilePic };

        // VERY IMPORTANT: Hash the password if provided
        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        const userResponse = updatedUser.toObject();
        delete userResponse.password; // Security

        res.status(200).json(userResponse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};