import React from "react";
import PlaceItem from "./PlaceItem";

const PlacesList =  (props) => {
    return (
        <>
            {!!props?.items?.length ? (
            <ul className="flex gap-y-4 flex-col">
                {props?.items?.map((place) => <PlaceItem key={place?.id} id={place?.id} image={place?.image} title={place?.title} description={place?.description} address={place?.address} creatorId={place?.creatorId}/>)}
            </ul>): (
            <p className="text-2xl">
                No Places Found. Maybe Create One.
            </p>
            )}
        </>
    )
}

export default PlacesList;