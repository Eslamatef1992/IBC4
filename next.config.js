/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["back.clsfinportal.com"],
    },
}

module.exports = nextConfig;

// module.exports = {
//     env: {
//         API_URL: "https://back.clsfinportal.com" //"http://localhost:4000"
//     },
//     // images: {
//     //     remotePatterns: [
//     //         {
//     //             hostname: 'back.clsfinportal.com', //localhost
//     //             port: '3001' //4000
//     //         }
//     //     ]
//     // }
// }
