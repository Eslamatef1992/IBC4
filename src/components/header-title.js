import Head from "next/head";

const HeaderTitle = ({ title, keywords, description })=> {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="keywords" content={keywords} />
                <meta name="description" content={description} />
            </Head>
        </>
    );
}

HeaderTitle.defaultProps = {
    title: "Welcome to Cloud Lift Solutions",
    keywords: "Cloud Lift Solutions",
    description: "Cloud Lift Solutions",
}
export default HeaderTitle;