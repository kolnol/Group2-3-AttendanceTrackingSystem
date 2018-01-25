package de.tum.atse.ats.Utils.ObjectifyUtils;

import com.googlecode.objectify.ObjectifyService;
import de.tum.atse.ats.Entity.User;

import java.util.List;

public class ObjectifyDatabaseImpl implements DatabaseInterface<User, Long> {

    @Override
    public User findById(Long id) {
        return null;
    }

    @Override
    public void deleteById(Long id) {

    }

    @Override
    public List<User> findAll() {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public User save(User newUser) {
        return null;
    }
}
