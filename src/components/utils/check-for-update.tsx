import { useState, useEffect } from "react";
import packageJson from "../../../package.json";

export const CheckForUpdate = () => {
    const [latestVersion, setLatestVersion] = useState<string>("");
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        const checkForUpdate = async () => {
            try {
                const res = await fetch("https://api.github.com/repos/NWBY/cftop/releases/latest")

                if (res.status !== 200) {
                    return;
                }

                const data: any = await res.json();
                const latestVersion = data.name;
                const version = latestVersion.replace("v", "");
                const currentVersion = packageJson.version;

                if (version > currentVersion) {
                    setLatestVersion(latestVersion);
                    setUpdateAvailable(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkForUpdate();
    }, []);


    return (
        <box>
            {updateAvailable && (
                <box>
                    <text>New version available ({latestVersion}) - </text>
                </box>
            )}
        </box>
    );
}