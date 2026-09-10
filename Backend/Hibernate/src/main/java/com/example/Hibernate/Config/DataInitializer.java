package com.example.Hibernate.Config;

import com.example.Hibernate.Model.Address;
import com.example.Hibernate.Model.Course;
import com.example.Hibernate.Model.Role;
import com.example.Hibernate.Model.Student;
import com.example.Hibernate.Model.User;
import com.example.Hibernate.Repository.CourseRepository;
import com.example.Hibernate.Repository.StudentRepository;
import com.example.Hibernate.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.email:admin@example.com}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @PostConstruct
    public void validateConfig() {
        if (adminPassword == null || adminPassword.trim().isEmpty()) {
            throw new IllegalStateException("Admin password environment variable/property (ADMIN_PASSWORD / app.admin.password) must be provided and non-empty.");
        }
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default ADMIN account if no admin exists
        if (!userRepository.existsByRole(Role.ADMIN)) {
            User admin = new User(
                adminUsername,
                adminEmail,
                passwordEncoder.encode(adminPassword),
                Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println(">>> Initialized default ADMIN account: " + adminUsername);
        }

        // Seed default USER account if no user exists
        if (!userRepository.existsByRole(Role.USER)) {
            User user = new User(
                "user",
                "user@example.com",
                passwordEncoder.encode("user123"),
                Role.USER
            );
            userRepository.save(user);
            System.out.println(">>> Initialized default USER account: user");
        }

        List<Course> courses;
        if (courseRepository.count() == 0) {
            // 10 Courses
            Course c1 = new Course("Java Full Stack Development", "6 Months", "Software Engineering");
            Course c2 = new Course("Python Full Stack Development", "6 Months", "Software Engineering");
            Course c3 = new Course("Web Development", "4 Months", "Web Technologies");
            Course c4 = new Course("Data Science", "8 Months", "Data & Analytics");
            Course c5 = new Course("Artificial Intelligence", "10 Months", "Intelligent Systems");
            Course c6 = new Course("Machine Learning", "8 Months", "Data & Analytics");
            Course c7 = new Course("Cloud Computing", "6 Months", "Infrastructure & Cloud");
            Course c8 = new Course("Cyber Security", "6 Months", "Information Security");
            Course c9 = new Course("Mobile App Development", "5 Months", "Mobile Technologies");
            Course c10 = new Course("DevOps Engineering", "6 Months", "Infrastructure & Cloud");

            courses = courseRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10));
        } else {
            courses = courseRepository.findAll();
        }

        if (studentRepository.count() == 0 && !courses.isEmpty()) {
            // 20 Students with 20 Addresses and assigned Courses
            List<Student> students = Arrays.asList(
                new Student("Arjun Sharma", "arjun.sharma@gmail.com", 9.20, new Address("Bengaluru", "Karnataka", "560001"), courses.get(0 % courses.size())),
                new Student("Ananya Reddy", "ananya.reddy@gmail.com", 8.85, new Address("Mysuru", "Karnataka", "570001"), courses.get(1 % courses.size())),
                new Student("Rahul Kumar", "rahul.kumar@gmail.com", 7.90, new Address("Mangaluru", "Karnataka", "575001"), courses.get(2 % courses.size())),
                new Student("Sneha Patil", "sneha.patil@gmail.com", 9.40, new Address("Hubballi", "Karnataka", "580020"), courses.get(3 % courses.size())),
                new Student("Vijay Gowda", "vijay.gowda@gmail.com", 8.20, new Address("Shivamogga", "Karnataka", "577201"), courses.get(4 % courses.size())),
                new Student("Pooja Nair", "pooja.nair@gmail.com", 8.95, new Address("Hassan", "Karnataka", "573201"), courses.get(5 % courses.size())),
                new Student("Rohit Verma", "rohit.verma@gmail.com", 7.65, new Address("Mandya", "Karnataka", "571401"), courses.get(6 % courses.size())),
                new Student("Kavya Rao", "kavya.rao@gmail.com", 9.15, new Address("Tumakuru", "Karnataka", "572101"), courses.get(7 % courses.size())),
                new Student("Akash Bhat", "akash.bhat@gmail.com", 8.40, new Address("Belagavi", "Karnataka", "590001"), courses.get(8 % courses.size())),
                new Student("Divya Shetty", "divya.shetty@gmail.com", 9.50, new Address("Chitradurga", "Karnataka", "577501"), courses.get(9 % courses.size())),
                new Student("Manish Singh", "manish.singh@gmail.com", 8.10, new Address("Bengaluru", "Karnataka", "560034"), courses.get(0 % courses.size())),
                new Student("Aishwarya Joshi", "aishwarya.joshi@gmail.com", 9.30, new Address("Mysuru", "Karnataka", "570005"), courses.get(1 % courses.size())),
                new Student("Vivek Raj", "vivek.raj@gmail.com", 7.80, new Address("Mangaluru", "Karnataka", "575003"), courses.get(2 % courses.size())),
                new Student("Meghana Rao", "meghana.rao@gmail.com", 8.70, new Address("Hubballi", "Karnataka", "580030"), courses.get(3 % courses.size())),
                new Student("Sandeep Kumar", "sandeep.kumar@gmail.com", 8.05, new Address("Shivamogga", "Karnataka", "577202"), courses.get(4 % courses.size())),
                new Student("Nandini Prasad", "nandini.prasad@gmail.com", 9.60, new Address("Hassan", "Karnataka", "573202"), courses.get(5 % courses.size())),
                new Student("Abhishek Gowda", "abhishek.gowda@gmail.com", 7.95, new Address("Mandya", "Karnataka", "571402"), courses.get(6 % courses.size())),
                new Student("Shreya Menon", "shreya.menon@gmail.com", 9.25, new Address("Tumakuru", "Karnataka", "572102"), courses.get(7 % courses.size())),
                new Student("Varun Kumar", "varun.kumar@gmail.com", 8.55, new Address("Belagavi", "Karnataka", "590002"), courses.get(8 % courses.size())),
                new Student("Harshitha B M", "harshitha.bm@gmail.com", 9.80, new Address("Chitradurga", "Karnataka", "577502"), courses.get(9 % courses.size()))
            );

            studentRepository.saveAll(students);
        }
    }
}
