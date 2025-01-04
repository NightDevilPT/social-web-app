const { PrismaClient } = require("@prisma/client");
const cliProgress = require("cli-progress");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const numberOfUsers = 5; // Number of users to create
  const postsPerUser = 5; // Number of posts per user
  const commentsPerPost = 5; // Number of comments per post by other users
  const likesPerPost = 5; // Number of likes per post by other users

  const totalTasks =
    numberOfUsers +
    numberOfUsers * postsPerUser +
    numberOfUsers * postsPerUser * (commentsPerPost + likesPerPost);

  const progressBar = new cliProgress.SingleBar(
    {
      format: "Progress | {bar} | {percentage}% | ETA: {eta}s | {value}/{total} tasks",
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(totalTasks, 0);

  let completedTasks = 0;

  // Step 1: Create Users
  const users = [];
  for (let i = 1; i <= numberOfUsers; i++) {
    const hashedPassword = await bcrypt.hash(`password${i}`, 10);
    users.push({
      username: `user${i}`,
      email: `user${i}@example.com`,
      password: hashedPassword,
    });
  }

  try {
    await prisma.user.createMany({
      data: users,
    });
  } catch (error) {
    console.error("Error creating users:", error.message);
  }

  progressBar.update((completedTasks += numberOfUsers));

  // Step 2: Fetch created users
  const createdUsers = await prisma.user.findMany();

  // Step 3: Create Posts in Bulk
  const posts = [];
  for (const user of createdUsers) {
    for (let j = 1; j <= postsPerUser; j++) {
      posts.push({
        title: `Post ${j} by ${user.username}`,
        content: `This is the content of post ${j} by user ${user.username}.`,
        userId: user.id,
      });
    }
  }

  try {
    await prisma.post.createMany({
      data: posts,
    });
  } catch (error) {
    console.error("Error creating posts:", error.message);
  }

  progressBar.update((completedTasks += posts.length));

  // Step 4: Add Comments and Likes in Bulk
  const comments = [];
  const likes = [];
  for (const user of createdUsers) {
    const otherPosts = await prisma.post.findMany({
      where: {
        userId: {
          not: user.id,
        },
      },
    });

    for (const post of otherPosts) {
      for (let k = 1; k <= commentsPerPost; k++) {
        comments.push({
          content: `This is a comment ${k} by ${user.username} on post "${post.title}".`,
          userId: user.id,
          postId: post.id,
        });
      }

      for (let l = 1; l <= likesPerPost; l++) {
        likes.push({
          userId: user.id,
          postId: post.id,
        });
      }
    }
  }

  try {
    await prisma.comment.createMany({
      data: comments,
    });
  } catch (error) {
    console.error("Error creating comments:", error.message);
  }

  progressBar.update((completedTasks += comments.length));

  try {
    await prisma.like.createMany({
      data: likes,
    });
  } catch (error) {
    console.error("Error creating likes:", error.message);
  }

  progressBar.update((completedTasks += likes.length));

  progressBar.stop();
  console.log("Dummy data generation with comments and likes completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
