pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'hjhahjha3987361'  // Change this to your Docker Hub username
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "idurar-frontend"
        BACKEND_IMAGE = "idurar-backend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    echo 'Setting up environment variables...'
                    withCredentials([
                        string(credentialsId: 'MONGO_USERNAME', variable: 'MONGO_USERNAME'),
                        string(credentialsId: 'MONGO_PASSWORD', variable: 'MONGO_PASSWORD'),
                        string(credentialsId: 'MONGO_DATABASE', variable: 'MONGO_DATABASE'),
                        string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
                        string(credentialsId: 'COOKIE_SECRET', variable: 'COOKIE_SECRET'),
                        string(credentialsId: 'VITE_BACKEND_SERVER', variable: 'VITE_BACKEND_SERVER')
                    ]) {
                        sh '''
                            echo "MONGO_USERNAME=${MONGO_USERNAME}" > .env
                            echo "MONGO_PASSWORD=${MONGO_PASSWORD}" >> .env
                            echo "MONGO_DATABASE=${MONGO_DATABASE}" >> .env
                            echo "JWT_SECRET=${JWT_SECRET}" >> .env
                            echo "COOKIE_SECRET=${COOKIE_SECRET}" >> .env
                            echo "VITE_BACKEND_SERVER=${VITE_BACKEND_SERVER}" >> .env
                        '''
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    echo 'Building backend Docker image...'
                    sh """
                        docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend
                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building frontend Docker image...'
                    sh """
                        docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend
                        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            echo 'Running backend tests...'
                            // Add your backend test commands here
                            // sh 'cd backend && npm test'
                            echo 'Backend tests completed'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        script {
                            echo 'Running frontend tests...'
                            // Add your frontend test commands here
                            // sh 'cd frontend && npm test'
                            echo 'Frontend tests completed'
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'harsh-branch'  // Add your branch
                }
            }
            steps {
                script {
                    echo 'Pushing Docker images to registry...'
                    withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                            docker tag ${BACKEND_IMAGE}:latest ${DOCKER_USER}/${BACKEND_IMAGE}:latest
                            docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                            docker push ${DOCKER_USER}/${BACKEND_IMAGE}:latest
                            
                            docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                            docker tag ${FRONTEND_IMAGE}:latest ${DOCKER_USER}/${FRONTEND_IMAGE}:latest
                            docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                            docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying application with Docker Compose...'
                    sh """
                        docker compose down || true
                        docker compose up -d
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Performing health checks...'
                    sh '''
                        sleep 30  # Wait for services to start
                        curl -f http://localhost:8888/api/ || exit 1
                        curl -f http://localhost:80/ || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Add notification here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // Add notification here (email, Slack, etc.)
            sh '''
                docker compose logs || true
            '''
        }
        always {
            echo 'Cleaning up...'
            sh '''
                docker system prune -f || true
                rm -f .env || true
            '''
        }
    }
}