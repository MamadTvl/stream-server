const config = {
    rtmp_server: {
        rtmp: {
            port: process.env.RTMP_PORT,
            chunk_size: 60000,
            gop_cache: true,
            ping: 60,
            ping_timeout: 30,
        },
        http: {
            port: process.env.HTTP_PORT,
            mediaroot: './media',
            allow_origin: '*',
        },
        auth: {
            play: true,
            publish: true,
            secret: process.env.RTMP_SECRET,
        },
        trans: {
            ffmpeg: process.env.FFMPEG,
            tasks: [
                {
                    app: 'live',
                    hls: true,
                    hlsFlags:
                        '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                },
            ],
        },
    },
};

export default config;
