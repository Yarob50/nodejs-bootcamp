const checkLoggedInUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader.split(" ")[1];
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (err) {
		res.status(401).json({ err });
	}
};

module.exports = checkLoggedInUser;
