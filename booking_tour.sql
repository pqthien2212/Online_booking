-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2024 at 06:00 AM
-- Server version: 8.4.0
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `booking_tour`
--

DELIMITER $$
--
-- Procedures
--
CREATE PROCEDURE `cancel_booking` (IN `p_booking_id` INT, IN `p_refund_amount` DECIMAL(10,2), IN `p_cancel_status` ENUM('Confirmed','Denied'))   BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION ROLLBACK;

    START TRANSACTION;

    UPDATE booking SET booking_status = 'Cancelled' WHERE booking_id = p_booking_id;

    INSERT INTO cancellation (cancel_date, cancel_status, refund_amount, booking_id, client_id)
    VALUES (NOW(), p_cancel_status, p_refund_amount, p_booking_id, (SELECT client_id FROM booking WHERE booking_id = p_booking_id));

    COMMIT;
END$$

CREATE PROCEDURE `insert_user` (IN `p_user_name` VARCHAR(50), IN `p_user_password` VARCHAR(255), IN `p_user_role` ENUM('administrator','client','tour_operator','tour_guide'), IN `p_level` VARCHAR(50), IN `p_client_type` VARCHAR(50), IN `p_to_type` VARCHAR(50), IN `p_tg_description` VARCHAR(255))   BEGIN
    declare exit handler for sqlexception rollback;

    start transaction;
    -- Insert into the users table
    INSERT INTO users (user_name, user_password, user_role)
    VALUES (p_user_name, p_user_password, p_user_role);

    -- Get the newly inserted user ID
    SET @new_user_id = LAST_INSERT_ID();

    -- Insert into the corresponding role table
    CASE p_user_role
        WHEN 'administrator' THEN
            INSERT INTO administrator(user_id, level)
            VALUES (@new_user_id, p_level);
        WHEN 'client' THEN
            INSERT INTO client(user_id, client_type)
            VALUES (@new_user_id, p_client_type);
        WHEN 'tour_operator' THEN
            INSERT INTO tour_operator(user_id, to_type)
            VALUES (@new_user_id, p_to_type);
        WHEN 'tour_guide' THEN
            INSERT INTO tour_guide(user_id, description)
            VALUES (@new_user_id, p_tg_description);
    END CASE;

    commit;
END$$

CREATE PROCEDURE `UpdateTourDates` ()   BEGIN
    -- Declare variables to store the new begin and end dates for each tour
    DECLARE new_date_begin DATE;
    DECLARE new_date_end DATE;

    -- Declare a cursor for looping through all the tours
    DECLARE done INT DEFAULT 0;
    DECLARE tour_id INT;

    -- Declare cursor for selecting all tour ids
    DECLARE tour_cursor CURSOR FOR 
        SELECT t.tour_id
        FROM tour t;

    -- Declare handler to close cursor when done
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Open the cursor
    OPEN tour_cursor;

    -- Loop through each tour
    read_loop: LOOP
        FETCH tour_cursor INTO tour_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Get the earliest date_begin and latest date_end for the current tour
        SELECT MIN(l.date_begin), MAX(l.date_end)
        INTO new_date_begin, new_date_end
        FROM locations l
        JOIN tour_location tl ON l.location_id = tl.location_id
        WHERE tl.tour_id = tour_id;

        -- Update the tour table with the new date_begin and date_end
        UPDATE tour
        SET date_begin = new_date_begin, date_end = new_date_end
        WHERE tour_id = tour_id;

    END LOOP;

    -- Close the cursor
    CLOSE tour_cursor;

END$$

CREATE PROCEDURE `UpdateTourDays` ()   BEGIN
    -- Declare a variable to store the total days
    DECLARE total_days INT;
    
    -- Declare a cursor to iterate through each tour_id
    DECLARE done INT DEFAULT 0;
    DECLARE cur_tour_id INT;
    
    -- Declare a cursor for tour_id from the tour table
    DECLARE tour_cursor CURSOR FOR 
    SELECT DISTINCT tour_id FROM tour_location;
    
    -- Declare a handler for the end of the cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    -- Open the cursor
    OPEN tour_cursor;
    
    -- Loop through each tour_id
    tour_loop: LOOP
        FETCH tour_cursor INTO cur_tour_id;
        
        -- Exit loop if no more data
        IF done THEN
            LEAVE tour_loop;
        END IF;
        
        -- Calculate the total days for the current tour_id
        SELECT SUM(l.days)
        INTO total_days
        FROM locations l
        INNER JOIN tour_location tl ON l.location_id = tl.location_id
        WHERE tl.tour_id = cur_tour_id;
        
        -- Update the tour table with the calculated total days
        UPDATE tour
        SET days = total_days
        WHERE tour_id = cur_tour_id;
    END LOOP;
    
    -- Close the cursor
    CLOSE tour_cursor;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accommodation`
--

CREATE TABLE `accommodation` (
  `accommodation_id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `days` int DEFAULT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ;

--
-- Dumping data for table `accommodation`
--

INSERT INTO `accommodation` (`accommodation_id`, `type`, `name`, `address`, `days`, `date_begin`, `date_end`) VALUES
(1, 'Guesthouse', 'Bai Chay Guesthouse', 'Bai Chay Guesthouse, Ha Long City', 2, '2024-11-01', '2024-11-02'),
(2, 'Resort', 'Vinpearl Resort & Spa Ha Long', 'Vinpearl Resort & Spa Ha Long, Ha Long City', 3, '2024-11-03', '2024-11-05'),
(3, 'Lodge', 'Cat Ba Eco-Lodge', 'Cat Ba Eco-Lodge, Cat Ba Island, Ha Long City', 3, '2024-11-06', '2024-11-08'),
(4, 'Boutique Hotel', 'La An Old Town Boutique', 'La An Old Town Boutique, Hoi An', 2, '2024-11-01', '2024-11-02'),
(5, 'Homestay', 'Countryside Garden Homestay', 'Countryside Garden Homestay, Hoi An', 2, '2024-11-03', '2024-11-04'),
(6, 'Villa', 'Anicca Riverside Villa', 'Anicca Riverside Villa, Hoi An', 3, '2024-11-05', '2024-11-07'),
(7, 'Resort', 'Vinpearl Resort & Spa Phu Quoc', 'Vinpearl Resort & Spa Phu Quoc, Bai Dai, Phu Quoc', 3, '2024-11-01', '2024-11-03'),
(8, 'Hotel', 'Sunset Beach Hotel', 'Sunset Beach Hotel, Duong Dong, Phu Quoc', 3, '2024-11-04', '2024-11-06'),
(9, 'Lodge', 'PhuQuoc EcoLodge', 'PhuQuoc EcoLodge, Cua Can, Phu Quoc', 3, '2024-11-07', '2024-11-09'),
(10, 'Cottage', 'Cottage Retreat Da Lat', 'Cottage Retreat Da Lat, Da Lat', 3, '2024-11-01', '2024-11-03'),
(11, 'Resort', 'Swiss-Belresort Tuyen Lam', 'Swiss-Belresort Tuyen Lam, Tuyen Lam Lake, Da Lat', 3, '2024-11-04', '2024-11-06'),
(12, 'Villa', 'Ana Mandara Villa', 'Ana Mandara Villa, Da Lat', 3, '2024-11-07', '2024-11-09'),
(13, 'Resort', 'Vinpearl Beachfront Nha Trang', 'Vinpearl Beachfront Nha Trang, Nha Trang Beachfront', 2, '2024-11-01', '2024-11-02'),
(14, 'Hotel', 'Boutik Cham Nha Trang Hotel', 'Boutik Cham Nha Trang Hotel, Nha Trang', 3, '2024-11-03', '2024-11-05'),
(15, 'Villa', 'Seaside Villas An Vien', 'Seaside Villas An Vien, An Vien Seaside Complex, Nha Trang', 3, '2024-11-06', '2024-11-08');

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `user_id` int NOT NULL,
  `level` enum('Manager','Coordinator','Supervisor') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `administrator`
--

INSERT INTO `administrator` (`user_id`, `level`) VALUES
(1, 'Manager'),
(2, 'Coordinator'),
(3, 'Supervisor'),
(4, 'Manager'),
(5, 'Coordinator'),
(26, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `booking_id` int NOT NULL,
  `booking_date` date DEFAULT NULL,
  `booking_status` enum('Confirmed','Cancelled','Pending') DEFAULT NULL,
  `participant_no` int DEFAULT '0',
  `tour_id` int NOT NULL,
  `client_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`booking_id`, `booking_date`, `booking_status`, `participant_no`, `tour_id`, `client_id`) VALUES
(1, '2024-10-01', 'Cancelled', 1, 1, 11),
(2, '2024-10-02', 'Cancelled', 1, 2, 12),
(3, '2024-10-03', 'Cancelled', 1, 3, 13),
(4, '2024-10-04', 'Confirmed', 1, 4, 14),
(5, '2024-10-05', 'Pending', 1, 5, 15),
(6, '2024-10-06', 'Confirmed', 2, 1, 16),
(7, '2024-10-07', 'Confirmed', 2, 2, 17),
(8, '2024-10-08', 'Pending', 2, 3, 18),
(9, '2024-10-09', 'Confirmed', 2, 4, 19),
(10, '2024-10-10', 'Confirmed', 2, 5, 20),
(11, '2024-10-11', 'Pending', 3, 1, 11),
(12, '2024-10-12', 'Confirmed', 3, 2, 12),
(13, '2024-10-13', 'Pending', 3, 3, 13),
(14, '2024-10-14', 'Confirmed', 3, 4, 14),
(15, '2024-10-15', 'Pending', 3, 5, 15),
(16, '2024-10-16', 'Confirmed', 4, 1, 16),
(17, '2024-10-17', 'Pending', 4, 2, 17),
(18, '2024-10-18', 'Confirmed', 4, 3, 18),
(19, '2024-10-19', 'Confirmed', 4, 4, 19),
(20, '2024-10-20', 'Pending', 4, 5, 20);

--
-- Triggers `booking`
--
DELIMITER $$
CREATE TRIGGER `update_participant_no` BEFORE INSERT ON `booking` FOR EACH ROW BEGIN
    SET NEW.participant_no = (SELECT COUNT(*) FROM booking WHERE NEW.tour_id = tour_id) + 1;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `cancellation`
--

CREATE TABLE `cancellation` (
  `cancel_id` int NOT NULL,
  `cancel_date` date DEFAULT NULL,
  `cancel_status` enum('Pending','Confirmed','Denied','Awaiting Refund','Refunded') DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `booking_id` int NOT NULL,
  `client_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cancellation`
--

INSERT INTO `cancellation` (`cancel_id`, `cancel_date`, `cancel_status`, `refund_amount`, `booking_id`, `client_id`) VALUES
(1, '2024-12-02', 'Confirmed', 450.00, 1, 11),
(2, '2024-12-02', 'Confirmed', 150.00, 2, 12),
(3, '2024-12-02', 'Denied', 0.00, 3, 13);

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `user_id` int NOT NULL,
  `client_type` enum('Individual','Business','Travel Agent') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`user_id`, `client_type`) VALUES
(11, 'Individual'),
(12, 'Travel Agent'),
(13, 'Business'),
(14, 'Travel Agent'),
(15, 'Individual'),
(16, 'Individual'),
(17, 'Business'),
(18, 'Individual'),
(19, 'Individual'),
(20, 'Individual');

-- --------------------------------------------------------

--
-- Table structure for table `contact_detail`
--

CREATE TABLE `contact_detail` (
  `contact_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_detail`
--

INSERT INTO `contact_detail` (`contact_id`, `user_id`, `phone_number`, `firstname`, `middlename`, `lastname`, `address`, `email`) VALUES
(1, 1, '0123450101', 'Phuc', 'Quang', 'Trieu', 'District 1', 'phuc.quang@email.com'),
(2, 2, '0123450102', 'Linh', 'Bo', 'Dinh', 'District 2', 'linh.bo@email.com'),
(3, 3, '0123450103', 'Uan', 'Cong', 'Ly', 'District 3', 'uan.cong@email.com'),
(4, 4, '0123450104', 'Do', 'Thu', 'Tran', 'District 4', 'do.thu@email.com'),
(5, 5, '0123450105', 'Tuan', 'Quoc', 'Tran', 'District 5', 'tuan.quoc@email.com'),
(6, 6, '0123450201', 'Toan', 'Quoc', 'Tran', 'District 6', 'toan.quoc@email.com'),
(7, 7, '0123450202', 'Ly', 'Quy', 'Ho', 'District 7', 'ly.quy@email.com'),
(8, 8, '0123450203', 'Trung', 'Nguyen', 'Ho', 'District 8', 'trung.nguyen@email.com'),
(9, 9, '0123450204', 'Thanh', 'Tu', 'Le', 'District 9', 'thanh.tu@email.com'),
(10, 10, '0123450205', 'Dung', 'Dang', 'Mac', 'District 10', 'dung.dang@email.com'),
(11, 11, '0123450301', 'Doanh', 'Dang', 'Mac', 'District 11', 'doanh.dang@email.com'),
(12, 12, '0123450302', 'Anh', 'Phuc', 'Nguyen', 'District 12', 'anh.phuc@email.com'),
(13, 13, '0123450303', 'San', 'Phuc Vinh', 'Nguyen', 'Go Vap District', 'san.vinh@email.com'),
(14, 14, '0123450304', 'Thuyet', 'That', 'Ton', 'Tan Binh District', 'thuyet.that@email.com'),
(15, 15, '0123450305', 'Tung', 'That', 'Ton', 'Binh Tan District', 'tung.that@email.com'),
(16, 16, '0123450306', 'Thang', 'Duc', 'Ton', 'Binh Thanh District', 'thang.duc@email.com'),
(17, 17, '0123450307', 'Tuong', 'Phu Ngoc', 'Hoang', 'Hoc Mon District', 'tuong.ngoc@email.com'),
(18, 18, '0123450308', 'Duy', 'Phong Hong', 'Nguyen', 'Nha Be District', 'duy.hong@email.com'),
(19, 19, '0123450309', 'Toan', 'Van', 'Nguyen', 'Binh Chanh District', 'toan.van@email.com'),
(20, 20, '0123450310', 'Son', 'Ngoc Truong', 'Nguyen', 'Can Gio District', 'son.truong@email.com'),
(21, 21, '0123452222', 'Tuan', 'Anh', 'La', 'District 11', 'tuan.la@email.com'),
(22, 22, '0123506532', 'Hang', 'Thi Phuong', 'Pham', 'Go Vap District', 'hang.pham@email.com'),
(23, 23, '0123450154', 'Ha', 'Thi Thu', 'Nguyen', 'Binh Tan District', 'ha.nguyen@email.com'),
(24, 24, '0123450875', 'Huy', 'Minh', 'Tran', 'Hoc Mon District', 'huy.tran@email.com'),
(25, 25, '0127382190', 'Vu', 'Ngoc', 'Tran', 'Binh Chanh District', 'vu.tran@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `days` int DEFAULT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `name`, `address`, `city`, `province`, `days`, `date_begin`, `date_end`) VALUES
(1, 'Hang dong Thien Cung', 'Vinh Ha Long, Quang Ninh', 'Ha Long', 'Quang Ninh', 2, '2024-11-01', '2024-11-02'),
(2, 'Vinh Ha Long', 'Quang Ninh', 'Ha Long', 'Quang Ninh', 2, '2024-11-03', '2024-11-04'),
(3, 'Dao Titop', 'Vinh Ha Long, Quang Ninh', 'Ha Long', 'Quang Ninh', 2, '2024-11-05', '2024-11-06'),
(4, 'Chua Cau Hoi An', 'Hoi An, Quang Nam', 'Hoi An', 'Quang Nam', 3, '2024-11-01', '2024-11-03'),
(5, 'Pho Hoi An', 'Hoi An, Quang Nam', 'Hoi An', 'Quang Nam', 3, '2024-11-04', '2024-11-06'),
(6, 'Bai Sao', 'Phu Quoc, Kien Giang', 'Phu Quoc', 'Kien Giang', 2, '2024-11-01', '2024-11-02'),
(7, 'Lang chai co Ham Ninh', 'Phu Quoc, Kien Giang', 'Phu Quoc', 'Kien Giang', 2, '2024-11-03', '2024-11-04'),
(8, 'Cho dem Phu Quoc', 'Phu Quoc, Kien Giang', 'Phu Quoc', 'Kien Giang', 2, '2024-11-05', '2024-11-06'),
(9, 'Doi che Cau Dat', 'Da Lat, Lam Dong', 'Da Lat', 'Lam Dong', 2, '2024-11-01', '2024-11-02'),
(10, 'Thung lung Tinh Yeu', 'Da Lat, Lam Dong', 'Da Lat', 'Lam Dong', 2, '2024-11-03', '2024-11-04'),
(11, 'Dinh Bao Dai', 'Da Lat, Lam Dong', 'Da Lat', 'Lam Dong', 2, '2024-11-05', '2024-11-06'),
(12, 'Bai Dai', 'Nha Trang, Khanh Hoa', 'Nha Trang', 'Khanh Hoa', 2, '2024-11-01', '2024-11-02'),
(13, 'Thap ba Ponagar', 'Nha Trang, Khanh Hoa', 'Nha Trang', 'Khanh Hoa', 3, '2024-11-03', '2024-11-05'),
(14, 'Cho Dam Nha Trang', 'Nha Trang, Khanh Hoa', 'Nha Trang', 'Khanh Hoa', 3, '2024-11-06', '2024-11-08');

-- --------------------------------------------------------

--
-- Table structure for table `manage`
--

CREATE TABLE `manage` (
  `admin_id` int NOT NULL,
  `booking_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `manage`
--

INSERT INTO `manage` (`admin_id`, `booking_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(4, 6),
(4, 7),
(5, 8),
(5, 9),
(5, 10),
(1, 11),
(1, 12),
(2, 13),
(2, 14),
(3, 15),
(3, 16),
(4, 17),
(4, 18),
(5, 19),
(5, 20);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int NOT NULL,
  `payment_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('Pending','Completed','Cancelled') DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `booking_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `payment_date`, `amount`, `payment_method`, `payment_status`, `client_id`, `booking_id`) VALUES
(1, '2024-10-01', 100.00, 'Credit Card', 'Completed', 11, 1),
(2, '2024-10-02', 150.00, 'PayPal', 'Completed', 12, 2),
(3, '2024-10-03', 200.00, 'Bank Transfer', 'Pending', 13, 3),
(4, '2024-10-04', 250.00, 'Credit Card', 'Cancelled', 14, 4),
(5, '2024-10-05', 300.00, 'PayPal', 'Completed', 15, 5),
(6, '2024-10-06', 120.00, 'Credit Card', 'Completed', 16, 6),
(7, '2024-10-07', 180.00, 'Bank Transfer', 'Completed', 17, 7),
(8, '2024-10-08', 220.00, 'Credit Card', 'Pending', 18, 8),
(9, '2024-10-09', 280.00, 'PayPal', 'Completed', 19, 9),
(10, '2024-10-10', 350.00, 'Credit Card', 'Completed', 20, 10),
(11, '2024-10-11', 130.00, 'PayPal', 'Completed', 11, 11),
(12, '2024-10-12', 160.00, 'Bank Transfer', 'Completed', 12, 12),
(13, '2024-10-13', 190.00, 'Credit Card', 'Pending', 13, 13),
(14, '2024-10-14', 240.00, 'PayPal', 'Completed', 14, 14),
(15, '2024-10-15', 310.00, 'Credit Card', 'Cancelled', 15, 15),
(16, '2024-10-16', 140.00, 'Credit Card', 'Completed', 16, 16),
(17, '2024-10-17', 170.00, 'Bank Transfer', 'Completed', 17, 17),
(18, '2024-10-18', 210.00, 'PayPal', 'Pending', 18, 18),
(19, '2024-10-19', 290.00, 'Credit Card', 'Completed', 19, 19),
(20, '2024-10-20', 360.00, 'PayPal', 'Completed', 20, 20);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `client_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `date_review` date DEFAULT NULL
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `tour_id`, `client_id`, `rating`, `comment`, `date_review`) VALUES
(1, 1, 11, 4, 'The tour offered something unique or special that set it apart from other options.', '2024-12-02'),
(2, 1, 12, 5, 'The tour was good value for the price.', '2024-05-20'),
(3, 1, 13, 5, 'The tour itinerary was well-planned and included interesting stops.', '2024-06-01'),
(4, 2, 14, 5, 'The tour was enjoyable and exceeded expectations.', '2024-06-01'),
(5, 2, 15, 4, 'The tour guide was knowledgeable, friendly, and engaging', '2024-06-05'),
(6, 2, 16, 5, 'I felt like I learned a lot about the local culture and history.', '2024-06-05'),
(7, 3, 17, 4, 'The pace of the tour was just right, not too fast and not too slow.', '2024-07-11'),
(8, 3, 18, 5, 'The tour was a great way to see the city and experience its unique attractions.', '2024-07-11'),
(9, 3, 19, 5, 'I would definitely recommend this tour to others.', '2024-03-04'),
(10, 4, 20, 5, 'The tour was enjoyable and exceeded expectations.', '2024-03-04'),
(11, 4, 11, 3, 'The tour did not offer enough opportunities for free time or exploration.', '2024-03-04'),
(12, 4, 12, 4, 'The tour guide was knowledgeable, friendly, and engaging', '2024-09-13'),
(13, 4, 13, 5, 'The tour itinerary was well-planned and included interesting stops.', '2024-10-12'),
(14, 5, 14, 5, 'The tour guide was able to answer all of our questions and provide helpful information.', '2024-11-05'),
(15, 5, 15, 3, 'The tour was not worth the price.', '2024-11-30'),
(16, 5, 16, 4, 'The tour offered a good balance of sightseeing, learning, and experiencing the local culture.', '2024-12-21');

-- --------------------------------------------------------

--
-- Table structure for table `tour`
--

CREATE TABLE `tour` (
  `tour_id` int NOT NULL,
  `tour_name` varchar(50) DEFAULT NULL,
  `tour_description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `days` int DEFAULT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL,
  `tg_id` int DEFAULT NULL,
  `to_id` int NOT NULL
) ;

--
-- Dumping data for table `tour`
--

INSERT INTO `tour` (`tour_id`, `tour_name`, `tour_description`, `price`, `capacity`, `days`, `date_begin`, `date_end`, `tg_id`, `to_id`) VALUES
(1, 'Ha Long Bay Cruise', 'A scenic cruise through the UNESCO World Heritage Site of Ha Long Bay, famous for its emerald waters and limestone islands.', 450.00, 20, 6, '2024-11-03', '2024-11-08', 21, 6),
(2, 'Hanoi City Highlights', 'Explore the historic city of Hanoi, including the Old Quarter, Ho Chi Minh Mausoleum, and traditional water puppet shows.', 150.00, 25, 6, '2024-11-03', '2024-11-08', 22, 7),
(3, 'Sapa Trekking Adventure', 'A multi-day trek through the rice terraces and local villages of Sapa, with breathtaking views of the Hoang Lien Son mountains.', 300.00, 15, 8, '2024-11-03', '2024-11-08', 23, 8),
(4, 'Mekong Delta Experience', 'A serene boat ride through the rivers of the Mekong Delta, visiting floating markets, fruit orchards, and local crafts villages.', 180.00, 30, 6, '2024-11-03', '2024-11-08', 24, 9),
(5, 'Phong Nha Cave Exploration', 'Explore the stunning caves of Phong Nha-Ke Bang National Park, including boat rides through the underground rivers.', 250.00, 20, 6, '2024-11-03', '2024-11-08', 25, 10);

-- --------------------------------------------------------

--
-- Table structure for table `tour_accommodation`
--

CREATE TABLE `tour_accommodation` (
  `accommodation_id` int NOT NULL,
  `tour_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_accommodation`
--

INSERT INTO `tour_accommodation` (`accommodation_id`, `tour_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 2),
(7, 3),
(8, 3),
(9, 3),
(10, 4),
(11, 4),
(12, 4),
(13, 5),
(14, 5),
(15, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tour_activities`
--

CREATE TABLE `tour_activities` (
  `tour_id` int NOT NULL,
  `tour_activity` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_activities`
--

INSERT INTO `tour_activities` (`tour_id`, `tour_activity`) VALUES
(1, 'Cheo thuyen kayak tren Vinh Ha Long'),
(1, 'Ngam hoang hon tu dao Titop'),
(1, 'Tham quan hang dong Thien Cung'),
(2, 'Tham gia tour am thuc duong pho Hoi An'),
(2, 'Tham quan chua Cau Hoi An'),
(2, 'Trai nghiem lam den long truyen thong'),
(3, 'Kham pha cho dem Phu Quoc'),
(3, 'Lan bien ngam san ho tai Bai Sao'),
(3, 'Tham quan lang chai co Ham Ninh'),
(4, 'Di bo da ngoai tren doi che Cau Dat'),
(4, 'Kham pha Thung lung Tinh Yeu'),
(4, 'Tham quan Dinh Bao Dai'),
(5, 'Choi the thao duoi nuoc tai Bai Dai'),
(5, 'Tham quan thap ba Ponagar'),
(5, 'Thuong thuc hai san tai cho Dam Nha Trang');

-- --------------------------------------------------------

--
-- Table structure for table `tour_guide`
--

CREATE TABLE `tour_guide` (
  `user_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_guide`
--

INSERT INTO `tour_guide` (`user_id`, `description`) VALUES
(21, 'A tour guide who is deeply knowledgeable about the destination and passionate about sharing their expertise can create a truly engaging experience.'),
(22, 'A charismatic tour guide can captivate their audience and create a memorable experience.'),
(23, 'A well-organized tour guide can ensure that the tour runs smoothly and efficiently.'),
(24, 'Tour guides should be able to adapt to changing circumstances, such as unexpected weather or changes in itineraries.'),
(25, 'A successful tour guide puts the needs and satisfaction of their guests first.');

-- --------------------------------------------------------

--
-- Table structure for table `tour_images`
--

CREATE TABLE `tour_images` (
  `tour_id` int NOT NULL,
  `tour_img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_images`
--

INSERT INTO `tour_images` (`tour_id`, `tour_img`) VALUES
(1, 'images/tour1.jpg'),
(1, 'images/tour11.jpg'),
(1, 'images/tour16.jpg'),
(1, 'images/tour6.jpg'),
(2, 'images/tour12.jpg'),
(2, 'images/tour17.jpg'),
(2, 'images/tour2.jpg'),
(2, 'images/tour7.jpg'),
(3, 'images/tour13.jpg'),
(3, 'images/tour18.jpg'),
(3, 'images/tour3.jpg'),
(3, 'images/tour8.jpg'),
(4, 'images/tour14.jpg'),
(4, 'images/tour19.jpg'),
(4, 'images/tour4.jpg'),
(4, 'images/tour9.jpg'),
(5, 'images/tour10.jpg'),
(5, 'images/tour15.jpg'),
(5, 'images/tour20.jpg'),
(5, 'images/tour5.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tour_location`
--

CREATE TABLE `tour_location` (
  `location_id` int NOT NULL,
  `tour_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_location`
--

INSERT INTO `tour_location` (`location_id`, `tour_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 3),
(7, 3),
(8, 3),
(9, 3),
(10, 4),
(11, 4),
(12, 4),
(13, 5),
(14, 5);

-- --------------------------------------------------------

--
-- Table structure for table `tour_operator`
--

CREATE TABLE `tour_operator` (
  `user_id` int NOT NULL,
  `to_type` enum('Inbound','Outbound','Domestic','Ground Operators','Receptive') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_operator`
--

INSERT INTO `tour_operator` (`user_id`, `to_type`) VALUES
(6, 'Inbound'),
(7, 'Outbound'),
(8, 'Domestic'),
(9, 'Ground Operators'),
(10, 'Receptive');

-- --------------------------------------------------------

--
-- Table structure for table `tour_vehicle`
--

CREATE TABLE `tour_vehicle` (
  `vehicle_id` int NOT NULL,
  `tour_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tour_vehicle`
--

INSERT INTO `tour_vehicle` (`vehicle_id`, `tour_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(1, 3),
(6, 3),
(7, 3),
(8, 3),
(2, 4),
(3, 4),
(4, 4),
(5, 5),
(6, 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_role` enum('administrator','client','tour_operator','tour_guide') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_password`, `user_role`) VALUES
(1, 'admin1@example.com', 'password1', 'administrator'),
(2, 'admin2@example.com', 'password2', 'administrator'),
(3, 'admin3@example.com', 'password3', 'administrator'),
(4, 'admin4@example.com', 'password4', 'administrator'),
(5, 'admin5@example.com', 'password5', 'administrator'),
(6, 'tour_operator1@example.com', '123456', 'tour_operator'),
(7, 'tour_operator2@example.com', '123456', 'tour_operator'),
(8, 'tour_operator3@example.com', '123456', 'tour_operator'),
(9, 'tour_operator4@example.com', '123456', 'tour_operator'),
(10, 'tour_operator5@example.com', '123456', 'tour_operator'),
(11, 'client1@example.com', '123456', 'client'),
(12, 'client2@example.com', '123456', 'client'),
(13, 'client3@example.com', '123456', 'client'),
(14, 'client4@example.com', '123456', 'client'),
(15, 'client5@example.com', '123456', 'client'),
(16, 'client6@example.com', '123456', 'client'),
(17, 'client7@example.com', '123456', 'client'),
(18, 'client8@example.com', '123456', 'client'),
(19, 'client9@example.com', '123456', 'client'),
(20, 'client10@example.com', '123456', 'client'),
(21, 'tourguide01@example.com', '123456', 'tour_guide'),
(22, 'tourguide02@example.com', '123456', 'tour_guide'),
(23, 'tourguide03@example.com', '123456', 'tour_guide'),
(24, 'tourguide04@example.com', '123456', 'tour_guide'),
(25, 'tourguide05@example.com', '123456', 'tour_guide'),
(26, 'admin5@example.com', 'password5', 'administrator');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicle_id` int NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `plate_no` varchar(255) NOT NULL,
  `days` int DEFAULT NULL,
  `date_begin` date DEFAULT NULL,
  `date_end` date DEFAULT NULL
) ;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`vehicle_id`, `type`, `name`, `plate_no`, `days`, `date_begin`, `date_end`) VALUES
(1, 'Xe du lich 7 cho', 'Honda Odyssey', '29B-54321', 2, '2024-11-01', '2024-11-02'),
(2, 'May bay', 'Vietnam Airlines', '16E-44333', 3, '2024-11-03', '2024-11-05'),
(3, 'Xe bus 30 cho', 'Hyundai Universe', '45F-66555', 2, '2024-11-06', '2024-11-07'),
(4, 'Xe bus 45 cho', 'Hino', '79G-88777', 3, '2024-11-01', '2024-11-03'),
(5, 'May bay', 'Bamboo Airways', '90J-55444', 2, '2024-11-04', '2024-11-05'),
(6, 'May bay', 'Vietnam Airlines', '16O-44444', 2, '2024-11-06', '2024-11-07'),
(7, 'May bay', 'Vietjet Air', '88S-88888', 2, '2024-11-01', '2024-11-02'),
(8, 'Xe bus 30 cho', 'Hyundai Universe', '16Y-10101', 2, '2024-11-03', '2024-11-04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accommodation`
--
ALTER TABLE `accommodation`
  ADD PRIMARY KEY (`accommodation_id`),
  ADD KEY `accommodation_idx` (`type`);

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `bookings_idx` (`tour_id`,`client_id`,`booking_status`);

--
-- Indexes for table `cancellation`
--
ALTER TABLE `cancellation`
  ADD PRIMARY KEY (`cancel_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `contact_detail`
--
ALTER TABLE `contact_detail`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `contact_idx` (`phone_number`,`email`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `location_idx` (`city`,`province`);

--
-- Indexes for table `manage`
--
ALTER TABLE `manage`
  ADD PRIMARY KEY (`admin_id`,`booking_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `payment_idx` (`payment_date`,`payment_status`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `reviews_idx` (`tour_id`,`client_id`,`rating`);

--
-- Indexes for table `tour`
--
ALTER TABLE `tour`
  ADD PRIMARY KEY (`tour_id`),
  ADD KEY `tg_id` (`tg_id`),
  ADD KEY `to_id` (`to_id`),
  ADD KEY `tours_idx` (`tour_name`,`price`);

--
-- Indexes for table `tour_accommodation`
--
ALTER TABLE `tour_accommodation`
  ADD PRIMARY KEY (`accommodation_id`,`tour_id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tour_activities`
--
ALTER TABLE `tour_activities`
  ADD PRIMARY KEY (`tour_id`,`tour_activity`);

--
-- Indexes for table `tour_guide`
--
ALTER TABLE `tour_guide`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD PRIMARY KEY (`tour_id`,`tour_img`);

--
-- Indexes for table `tour_location`
--
ALTER TABLE `tour_location`
  ADD PRIMARY KEY (`location_id`,`tour_id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tour_operator`
--
ALTER TABLE `tour_operator`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `tour_vehicle`
--
ALTER TABLE `tour_vehicle`
  ADD PRIMARY KEY (`vehicle_id`,`tour_id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `users_idx` (`user_name`,`user_role`);

--
-- Indexes for table `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicle_id`),
  ADD KEY `vehicle_idx` (`type`,`plate_no`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accommodation`
--
ALTER TABLE `accommodation`
  MODIFY `accommodation_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `cancellation`
--
ALTER TABLE `cancellation`
  MODIFY `cancel_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `contact_detail`
--
ALTER TABLE `contact_detail`
  MODIFY `contact_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tour`
--
ALTER TABLE `tour`
  MODIFY `tour_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `vehicle`
--
ALTER TABLE `vehicle`
  MODIFY `vehicle_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `administrator`
--
ALTER TABLE `administrator`
  ADD CONSTRAINT `administrator_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `client` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cancellation`
--
ALTER TABLE `cancellation`
  ADD CONSTRAINT `cancellation_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cancellation_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contact_detail`
--
ALTER TABLE `contact_detail`
  ADD CONSTRAINT `contact_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `manage`
--
ALTER TABLE `manage`
  ADD CONSTRAINT `manage_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `manage_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `client` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `client` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour`
--
ALTER TABLE `tour`
  ADD CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`tg_id`) REFERENCES `tour_guide` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tour_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `tour_operator` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_accommodation`
--
ALTER TABLE `tour_accommodation`
  ADD CONSTRAINT `tour_accommodation_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tour_accommodation_ibfk_2` FOREIGN KEY (`accommodation_id`) REFERENCES `accommodation` (`accommodation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_activities`
--
ALTER TABLE `tour_activities`
  ADD CONSTRAINT `tour_activities_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_guide`
--
ALTER TABLE `tour_guide`
  ADD CONSTRAINT `tour_guide_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_images`
--
ALTER TABLE `tour_images`
  ADD CONSTRAINT `tour_images_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_location`
--
ALTER TABLE `tour_location`
  ADD CONSTRAINT `tour_location_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tour_location_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_operator`
--
ALTER TABLE `tour_operator`
  ADD CONSTRAINT `tour_operator_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tour_vehicle`
--
ALTER TABLE `tour_vehicle`
  ADD CONSTRAINT `tour_vehicle_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tour_vehicle_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
