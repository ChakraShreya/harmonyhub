import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import {makeAuthenticatedGETRequest} from "../utils/serverHelpers";
import SingleSongCard from "../components/shared/SingleSongCard";

const SinglePlaylistView = () => {
    const [playlistDetails, setPlaylistDetails] = useState({});
    const {playlistId} = useParams();

    useEffect(() => {
        const getData = async () => {
            const response = await makeAuthenticatedGETRequest(
                "/playlist/get/playlist/" + playlistId
            );
            console.log("response is: ", response.data[0])
            setPlaylistDetails(response.data[0]);
        };
        
        const fetchDataWithDelay = async () => {
            // Wait for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Now fetch the data
            getData();
        };
        
        fetchDataWithDelay();
        console.log("playlist details id: ", playlistDetails.id);
    }, []);
    const arr = [playlistDetails.songs];
    // const arr = []

    return (
        <LoggedInContainer curActiveScreen={"library"}>
            {playlistDetails.id && (
                <div>
                    <div className="text-white text-xl pt-8 font-semibold">
                        {playlistDetails.name}
                    </div>
                    <div className="pt-10 space-y-3">
                        
                        {
                        arr.map((item) => {
                            return (
                                <SingleSongCard
                                    info={item}
                                    key={JSON.stringify(item)}
                                    playSound={() => {}}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </LoggedInContainer>
    );
};

export default SinglePlaylistView;
