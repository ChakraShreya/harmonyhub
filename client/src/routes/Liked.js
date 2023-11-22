import {useState, useEffect} from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import LoggedInContainer from "../containers/LoggedInContainer";

const LikedSongs = () => {
    const [songData, setSongData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/song/get/likedSongs"
            );
            setSongData(response.data);
        };

        const fetchDataWithDelay = async () => {
            // Wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
    
            // Now fetch the data
            getData();
        };

        fetchDataWithDelay();
        console.log("song data: ", songData);
    }, []);


    return (
        <LoggedInContainer curActiveScreen="myMusic">
            <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                Liked Songs
            </div>
            <div className="space-y-3 overflow-auto">
                {songData.map((item) => {
                    return <SingleSongCard info={item} playSound={() => {}} />;
                })}
            </div>
        </LoggedInContainer>
    );
};

export default LikedSongs;
