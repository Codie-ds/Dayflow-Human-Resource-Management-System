const db = require("../config/db");
const bcrypt = require("bcryptjs");
const generatePassword = require("../utils/generatePassword");
const generateLoginId = require("../utils/generateLoginId");

// SIGNUP (Admin / Organization)
exports.signup = async (req, res) => {
    const { companyName, fullName, email, phone } = req.body;
    const year = new Date().getFullYear();

    try {
        const companyCode = companyName.substring(0, 3).toUpperCase();

        // Create organization
        db.query(
            "INSERT INTO organizations (company_name, company_code, email, phone) VALUES (?, ?, ?, ?)",
            [companyName, companyCode, email, phone],
            (err, orgResult) => {
                if (err) return res.status(500).json(err);

                const orgId = orgResult.insertId;

                // Serial number (first user = 1)
                const serial = 1;
                const loginId = generateLoginId(companyName, fullName, year, serial);

                const plainPassword = generatePassword();
                const hashedPassword = bcrypt.hashSync(plainPassword, 10);

                db.query(
                    `INSERT INTO users 
           (organization_id, login_id, full_name, email, phone, password_hash, year_of_joining, serial_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [orgId, loginId, fullName, email, phone, hashedPassword, year, serial],
                    () => {
                        res.json({
                            message: "Organization created",
                            loginId,
                            tempPassword: plainPassword
                        });
                    }
                );
            }
        );
    } catch (err) {
        res.status(500).json(err);
    }
};

// LOGIN
exports.login = (req, res) => {
    const { loginId, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE login_id = ? OR email = ?",
        [loginId, loginId],
        (err, results) => {
            if (err || results.length === 0)
                return res.status(401).json({ message: "Invalid credentials" });

            const user = results[0];
            const isMatch = bcrypt.compareSync(password, user.password_hash);

            if (!isMatch)
                return res.status(401).json({ message: "Invalid credentials" });

            res.json({
                message: "Login successful",
                role: user.role,
                isFirstLogin: user.is_first_login
            });
        }
    );
};
