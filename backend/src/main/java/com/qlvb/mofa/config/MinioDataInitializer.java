// package com.qlvb.mofa.config;

// import com.qlvb.mofa.entity.FileEntity;
// import com.qlvb.mofa.repository.FileRepository;
// import io.minio.BucketExistsArgs;
// import io.minio.MakeBucketArgs;
// import io.minio.MinioClient;
// import io.minio.PutObjectArgs;
// import io.minio.StatObjectArgs;
// import io.minio.StatObjectResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import java.io.ByteArrayInputStream;
// import java.io.InputStream;
// import java.net.URI;
// import java.security.MessageDigest;
// import java.time.LocalDateTime;

// @Configuration
// @RequiredArgsConstructor
// public class MinioDataInitializer {

//     private final FileRepository fileRepository;

//     @Bean
//     CommandLineRunner initMinioAndSaveToDb() {
//         return args -> {
//             String endpoint = "http://localhost:9000";
//             String accessKey = "minioadmin";
//             String secretKey = "minioadmin123";
//             String bucketName = "qlvb";

//             String fileUrl = "https://www.ttgdqp.edu.vn/upload/3/14565/Gi%C3%A1o%20tr%C3%ACnh%20Gi%C3%A1o%20d%E1%BB%A5c%20Qu%E1%BB%91c%20ph%C3%B2ng%20v%C3%A0%20An%20ninh%20T%E1%BA%ADp%202.pdf";
//             String storagePath = "/uploads/books/giao-trinh-giao-duc-quoc-phong-va-an-ninh-tap-2.pdf";
//             String fileName = "Giáo trình Giáo dục Quốc phòng và An ninh Tập 2.pdf";
//             String mimeType = "application/pdf";
//             Long uploadedBy = 1L;
//             String entityType = "BOOK_DOCUMENT";
//             Long entityId = 1L;

//             MinioClient minioClient = MinioClient.builder()
//                     .endpoint(endpoint)
//                     .credentials(accessKey, secretKey)
//                     .build();

//             boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
//             if (!found) {
//                 minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
//             }

//             URI uri = new URI(fileUrl);
//             try (InputStream inputStream = uri.toURL().openStream()) {
//                 byte[] fileBytes = inputStream.readAllBytes();
//                 long fileSize = fileBytes.length;

//                 minioClient.putObject(
//                         PutObjectArgs.builder()
//                                 .bucket(bucketName)
//                                 .object(storagePath)
//                                 .stream(new ByteArrayInputStream(fileBytes), fileSize, -1)
//                                 .contentType(mimeType)
//                                 .build()
//                 );

//                 StatObjectResponse stat = minioClient.statObject(
//                         StatObjectArgs.builder()
//                                 .bucket(bucketName)
//                                 .object(storagePath)
//                                 .build()
//                 );

//                 MessageDigest digest = MessageDigest.getInstance("SHA-256");
//                 byte[] encodedhash = digest.digest(fileBytes);
//                 StringBuilder hexString = new StringBuilder(2 * encodedhash.length);
//                 for (byte b : encodedhash) {
//                     String hex = Integer.toHexString(0xff & b);
//                     if (hex.length() == 1) {
//                         hexString.append('0');
//                     }
//                     hexString.append(hex);
//                 }
//                 String calculatedHash = hexString.toString().substring(0, Math.min(hexString.length(), 20));

//                 FileEntity fileEntity = new FileEntity();
//                 fileEntity.setFileName(fileName);
//                 fileEntity.setStoragePath(storagePath);
//                 fileEntity.setMimeType(mimeType);
//                 fileEntity.setFileSize(stat.size());
//                 fileEntity.setFileHash(calculatedHash);
//                 fileEntity.setEntityType(entityType);
//                 fileEntity.setEntityId(entityId);
//                 fileEntity.setCreatedAt(LocalDateTime.now());

//                 fileRepository.save(fileEntity);
//             }
//         };
//     }
// }