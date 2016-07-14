FROM gps-tracker-base

ENV PORT 8081
ENV DATABASE_URL pg://postgres:postgres@172.17.0.1:5432/gpstracker
ENV TERM=xterm

RUN /src/app/Installations/ngrok authtoken 6P7s94jsKYmX64Loqks4D_2tSbbTqnvo7pLoZpu36AC

CMD ["node","bin/www/","--start-tcp"]