pipeline {
    agent any

    environment {
        PROJECT_DIR = "./" // Root directory of the project
        DOCKER_COMPOSE_FILE = "docker-compose.yml" // Path to the Docker Compose file
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Checking out code from repository..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Building Docker images for all services..."
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build"
            }
        }

        stage('Run Services') {
            steps {
                echo "🚀 Starting all services using Docker Compose..."
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
            }
        }

        stage('Verify Services') {
            steps {
                echo "✅ Verifying that all services are running..."
                sh "docker ps"
            }
        }
    }

    post {
        success {
            echo "🎉 Jenkins pipeline completed successfully!"
        }
        failure {
            echo "❌ Jenkins pipeline failed. Check the logs for details."
        }
    }
}