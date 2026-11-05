export const sendMessage = async (req, res) => {
    const { message } = req.body;
    console.log(message);
    return res.status(200).json({
        success: true,
        message: 'Message sent successfully',
    });
};
