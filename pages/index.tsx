import {getSession, useSession} from 'next-auth/client';
import {GetServerSideProps} from "next";
import {getCurrUserFeedRequest, getDemoFeedRequest} from "../utils/requests";
import React from "react";
import Link from "next/link";
import UpdateFeed from "../components/UpdateFeed";

export default function Home({userData, feedData}) {
    const [session, loading] = useSession();

    console.log(userData, feedData);

    let followUsers: {
        name: string,
        image: string,
        urlName: string,
    }[] = [];

    if (userData) {
        followUsers = feedData.map(user => ({name: user.name, image: user.image, urlName: user.urlName}));
    }

    return (
        <>
            <div className="max-w-4xl relative mx-auto px-4">
                {userData ? (
                    <>
                        <div className="flex items-center">
                            <h1 className="up-h1">Your feed</h1>
                            <Link href={"/@" + userData.urlName}><a className="up-button text ml-auto">Your profile</a></Link>
                            <Link href="/new-update"><a className="up-button primary ml-4">Post new update</a></Link>
                        </div>
                        <div className="my-6">
                            <h3 className="up-ui-title">Following ({followUsers.length})</h3>
                            <p>Ask friends to share their Updately profiles with you to follow them!</p>
                        </div>
                        <div className="flex wrap">
                            {followUsers.map(user => (
                                <Link href={"/@" + user.urlName}>
                                    <a>
                                        <img src={user.image} className="w-10 h-10 rounded-full mr-4" alt={user.name}/>
                                    </a>
                                </Link>
                            ))}
                        </div>
                        <UpdateFeed feedData={feedData} count={20}/>
                    </>
                ) : (
                    <>
                        <h1 className="up-h1">Welcome to Updately!</h1>
                        <div className="prose content my-6">
                            <p>Updately is a <b>social platform for daily updates</b> (or weekly or hourly, whatever works for you).</p>
                            <p>How it works is pretty straightforward:</p>
                            <ol>
                                <li>Post an update on Updately</li>
                                <li>Everyone who follows you will see it in their feed</li>
                                <li>Follow your friends or coworkers on Updately</li>
                                <li>See their updates in your feed</li>
                            </ol>
                            <p>Check out some (real!) examples:</p>
                        </div>
                        <UpdateFeed feedData={feedData} count={3}/>
                        <hr className="my-12"/>
                        <div className="prose content my-6">
                            <p>So what are you waiting for? <b>Hit that blue button on the navbar to sign up now!</b></p>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        const feedData = await getDemoFeedRequest();
        return {props: {userData: null, feedData: JSON.parse(JSON.stringify(feedData))}}
    }

    let {userData, feedData} = await getCurrUserFeedRequest(session.user.email);
    return {props: {userData: JSON.parse(JSON.stringify(userData)), feedData: JSON.parse(JSON.stringify(feedData || []))}};
};