import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findReferralRoute, secretKey } from "../utils/APIRoutes";
import axios from "axios";

function ReferralRedirect() {
    const { shortId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (shortId) {
            axios.post(findReferralRoute, { shortId: shortId }, {
                headers: {
                    "api-key": secretKey
                }
            })
                .then((res) => {
                    if (res.data.status === true) {
                        console.log(shortId)
                        // Delete it first (optional but clear)
                        document.cookie = "refCode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        // Then set new value
                        document.cookie = `refCode=${shortId}; path=/;`;
                        localStorage.setItem("refCode", shortId);
                    }
                    else {
                        document.cookie = "refCode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        document.cookie = `refCode=hero; path=/; SameSite=Lax`;
                        localStorage.setItem("refCode", "hero");
                    }
                })
                .catch((error) => {
                    console.error("Error finding referral code:", error);
                    document.cookie = `refCode=hero; path=/; SameSite=Lax`;
                    localStorage.setItem("refCode", "hero");
                });
        }
        navigate("/userHome");
    }, [shortId, navigate]);

    return <p>Redirecting...</p>;
}

export default ReferralRedirect;
