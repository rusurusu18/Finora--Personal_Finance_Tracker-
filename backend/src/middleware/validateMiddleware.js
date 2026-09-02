export const validate = (schema) => {
    return (req, res, next) => {

        try {

            const result = schema.safeParse(
                req.body
            );


            if (!result.success) {

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: result.error.issues
                });
            }


            req.body = result.data;

            next();

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid request data"
            });
        }
    };
};