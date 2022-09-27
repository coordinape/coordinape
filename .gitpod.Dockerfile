FROM gitpod/workspace-full:latest

RUN bash -c 'VERSION="14.18.1" \
    && source $HOME/.nvm/nvm.sh && nvm install $VERSION \
    && nvm use $VERSION && nvm alias default $VERSION'

RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix

ENV EXTRA_CORS_ALLOWED_ORIGINS '*'
ENV DISABLE_CORS_CHECKS 1
ENV DISABLE_CUSTOM_CORS_APIGATEWAY 1
