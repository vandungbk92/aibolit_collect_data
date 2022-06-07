pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
                telegramSend(message: 'Building job: $PROJECT_NAME ... - Link: $BUILD_URL', chatId: -740504133)
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/aibolitdata ./thinklabsdev/aibolitdataCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/aibolitdata \
                                    && docker service rm aibolitdata_web || true \
                                    && docker stack deploy -c ./thinklabsdev/aibolitdataCI/docker-compose.yml aibolitdata \
                                    && rm -rf ./thinklabsdev/aibolitdataCIB \
                                    && mv ./thinklabsdev/aibolitdataCI/ ./thinklabsdev/aibolitdataCIB",
                                execTimeout: 18000000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/aibolitdataCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, app/, server/, webpack/, uploads/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
                telegramSend(message: 'Build - $PROJECT_NAME – # $BUILD_NUMBER – STATUS: $BUILD_STATUS!', chatId: -740504133)
            }
        }
    }
}
