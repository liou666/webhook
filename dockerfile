

FROM nginx 

ARG BRANCH=master GIT_PROJECT_NAME

COPY ./project/${BRANCH}/${GIT_PROJECT_NAME}/dist /usr/share/nginx/html

EXPOSE 80
