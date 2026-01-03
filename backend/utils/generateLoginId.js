module.exports = (companyName, fullName, year, serial) => {
    const companyCode = companyName.substring(0, 3).toUpperCase();
    const nameParts = fullName.split(" ");
    const nameCode =
        nameParts[0][0].toUpperCase() +
        (nameParts[1] ? nameParts[1][0].toUpperCase() : "X");

    return `${companyCode}${nameCode}${year}${String(serial).padStart(4, "0")}`;
};
